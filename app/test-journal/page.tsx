'use client';

export default function TestJournalPage() {
  return (
    <div className="p-8">
      <h1 className="text-3xl font-bold text-center mb-8">Test Journal Page</h1>
      <p className="text-center">If you can see this, navigation is working!</p>
      <div className="mt-8 text-center">
        <button 
          onClick={() => console.log('Button clicked!')}
          className="bg-purple-500 text-white px-6 py-3 rounded-lg hover:bg-purple-600"
        >
          Test Button
        </button>
      </div>
    </div>
  );
}