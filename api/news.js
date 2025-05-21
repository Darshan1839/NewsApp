// api/news.js

export default async function handler(req, res) {
  const apiKey = process.env.NEWS_API_KEY;
  const query = req.query.q || "technology";

  try {
    const response = await fetch(`https://newsapi.org/v2/everything?q=${query}&apiKey=${apiKey}`);
    const data = await response.json();
    res.status(200).json(data);
  } catch (error) {
    res.status(500).json({ message: "Server Error", error: error.message });
  }
}
