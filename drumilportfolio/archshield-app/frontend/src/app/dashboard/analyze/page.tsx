export default function AnalyzePage() {
  return (
    <>
      <h1>Analyze Architecture</h1>
      <p>Upload infrastructure files and run a security, cost, scalability, and reliability review.</p>
      <div className="card">
        <h3>Ready for upload</h3>
        <p>Terraform, CloudFormation, Kubernetes YAML, and architecture diagrams can be queued here.</p>
        <button>Run Analysis</button>
      </div>
    </>
  );
}
