const recommendations = ["Enable bucket encryption", "Reduce oversized compute instances", "Add health checks to public endpoints"];

export default function RecommendationsPage() {
  return (
    <>
      <h1>Recommendations</h1>
      <div className="grid">
        {recommendations.map((item) => (
          <article className="card" key={item}>
            <span className="status">Recommended</span>
            <h3>{item}</h3>
            <p>Review impact, priority, and implementation guidance before applying.</p>
          </article>
        ))}
      </div>
    </>
  );
}
