const express = require("express");
const { testConnection } = require("./db/sequelize");
const { Auction, Bid, sequelize } = require("./models");

const app = express();

app.use(express.json());

app.post("/bid", async (req, res) => {
  const { auction_id, user_id, amount } = req.body;

  try {
    const bid = await sequelize.transaction(async (t) => {
      // Instead of using DB directly we can use redis for locking the auction to prevent concurrent bids on it. But for now we will use DB transaction and lock the auction row for update.
      // Lock the auction to prevent concurrent bids on it
      const auction = await Auction.findByPk(auction_id, {
        transaction: t,
        lock: t.LOCK.UPDATE
      });


      if (new Date(auction.expires_at) <= new Date()) {
        throw new Error("Auction has expired");
      }

      // Get the current highest bid
      const lastBid = await Bid.findOne({
        where: { auction_id },
        order: [["amount", "DESC"]],
        transaction: t
      });

      // Validate the bid amount
      if (lastBid && Number(amount) <= Number(lastBid.amount)) {
        throw new Error("Bid must be greater than the highest bid");
      }

      if (!lastBid && Number(amount) < Number(auction.minimum_price)) {
        throw new Error("Bid must meet the minimum price");
      }

      // Insert the bid
      return await Bid.create(
        { auction_id, user_id, amount },
        { transaction: t }
      );
    });

    return res.status(201).json({
      message: "Bid placed successfully",
      bid
    });
  } catch (error) {
    const status = error.message === "Auction not found" ? 404 : 400;

    return res.status(status).json({
      message: error.message
    });
  }
});

app.use((err, req, res, next) => {
  console.error(err);
  return res.status(500).json({ message: "Internal server error" });
});

const PORT = process.env.PORT || 3000;

app.listen(PORT, async () => {
  console.log(`Server listening on port ${PORT}`);
  await testConnection();
});
