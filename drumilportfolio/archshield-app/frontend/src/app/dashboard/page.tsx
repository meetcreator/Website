export default function DashboardPage() {
  return (
    <>
      <div className="toolbar">
        <div>
          <h1>Architecture Dashboard</h1>
          <p>Track analyses, recommendations, and cloud posture from one workspace.</p>
        </div>
        <span className="status">Healthy</span>
      </div>
      <div className="grid">
        <div className="card metric"><h3>Security Score</h3><strong>92</strong><p>IAM, encryption, and network checks look strong.</p></div>
        <div className="card metric"><h3>Cost Findings</h3><strong>18</strong><p>Rightsizing and scheduling opportunities detected.</p></div>
        <div className="card metric"><h3>Open Actions</h3><strong>7</strong><p>Prioritized changes ready for review.</p></div>
      </div>
    </>
  );
}
