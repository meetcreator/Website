
export default function AnalyzePage() {
    return (
        <div className="p-8">
            <h2 className="text-3xl font-bold tracking-tight text-white mb-4">Analyze Architecture</h2>
            <div className="rounded-lg border border-dashed border-slate-700 p-12 text-center">
                <p className="text-slate-400">Upload your Terraform or CloudFormation files here to start analysis.</p>
                {/* File upload component would go here */}
            </div>
        </div>
    );
}
