import React, { useState } from 'react';

const CodingSpace: React.FC<{ question: string }> = ({ question }) => {
    const [code, setCode] = useState("");
    const [result, setResult] = useState<string | null>(null);

    const handleCheck = async () => {
    setResult("Checking...");
    const res = await fetch("/api/check-code", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ question, code }),
    });
    const data = await res.json();
    setResult(data.result); // "Correct" or "Incorrect"
    };


    return (
        <div className="p-4">
        <h2 className="text-xl font-semibold mb-2">Question</h2>
        <pre className="bg-gray-100 p-4 rounded mb-4">{question}</pre>

        <h3 className="text-lg font-semibold mb-1">Your Solution</h3>
        <textarea
            value={code}
            onChange={(e) => setCode(e.target.value)}
            className="w-full h-64 p-2 border rounded"
            placeholder="Write your JavaScript solution here..."
        />

        {/* Add a submit button later */}
        <button onClick={handleCheck} className="mt-2 px-4 py-2 bg-purple-600 text-white rounded">Check Solution</button>
        {result && <p className="mt-2 font-semibold">{result}</p>}
        </div>
    );
};

export default CodingSpace;
