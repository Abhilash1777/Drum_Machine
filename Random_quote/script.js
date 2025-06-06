
const quotes = [
  { text: "Do not dwell in the past, do not dream of the future, concentrate the mind on the present moment.", author: "Buddha" },
  { text: "Life is 10% what happens to us and 90% how we react to it.", author: "Charles R. Swindoll" },
  { text: "The best way to predict the future is to create it.", author: "Peter Drucker" },
  { text: "You miss 100% of the shots you don’t take.", author: "Wayne Gretzky" },
  { text: "If you can dream it, you can do it.", author: "Walt Disney" }
];

const colors = [
  "#16a085", "#27ae60", "#2c3e50", "#f39c12",
  "#e74c3c", "#9b59b6", "#FB6964", "#342224",
  "#472E32", "#BDBB99", "#77B1A9", "#73A857"
];

function getRandomItem(arr) {
  const index = Math.floor(Math.random() * arr.length);
  return arr[index];
}

function QuoteBox() {
  const [quote, setQuote] = React.useState(getRandomItem(quotes));
  const [color, setColor] = React.useState(getRandomItem(colors));

  const handleNewQuote = () => {
    setQuote(getRandomItem(quotes));
    setColor(getRandomItem(colors));
  };

  const styles = {
    backgroundColor: color,
    color: color,
    transition: "all 0.5s ease-in-out"
  };

  return (
    <div style={{ ...styles, minHeight: "100vh", display: "flex", alignItems: "center", justifyContent: "center" }}>
      <div id="quote-box" style={{ backgroundColor: "white", padding: "2rem", borderRadius: "10px", maxWidth: "600px", width: "100%" }}>
        <p id="text" style={{ color }}>{`"${quote.text}"`}</p>
        <p id="author" style={{ color }}>- {quote.author}</p>

        <div className="buttons" style={{ display: "flex", justifyContent: "space-between", marginTop: "1rem" }}>
          <a
            id="tweet-quote"
            href={`https://twitter.com/intent/tweet?text="${quote.text}" - ${quote.author}`}
            target="_blank"
            rel="noopener noreferrer"
            style={{ backgroundColor: color, color: "white", padding: "10px 20px", borderRadius: "5px", textDecoration: "none" }}
          >
            Tweet
          </a>
          <button
            id="new-quote"
            onClick={handleNewQuote}
            style={{ backgroundColor: color, color: "white", padding: "10px 20px", border: "none", borderRadius: "5px", cursor: "pointer" }}
          >
            New Quote
          </button>
        </div>
      </div>
    </div>
  );
}

const root = ReactDOM.createRoot(document.getElementById("root"));
root.render(<QuoteBox />);

