import { AsyncRouter } from "express-async-router";

const router = AsyncRouter();

router.post("/login", async (req, res) => {
  res.json({ status: "ok" });
});

export default router;
