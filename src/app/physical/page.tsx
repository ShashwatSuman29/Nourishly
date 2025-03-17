import FoodImageAnalyzer from '@/components/physical/FoodImageAnalyzer';

export default function Physical() {
  return (
    <div className="container mx-auto p-6 max-w-4xl">
      <h1 className="text-3xl font-bold mb-6">Physical Wellness</h1>
      
      <div className="space-y-6">
        <section>
          <h2 className="text-2xl font-semibold mb-4">Food Analysis</h2>
          <div className="bg-white rounded-xl shadow-sm p-6">
            <FoodImageAnalyzer />
          </div>
        </section>
      </div>
    </div>
  );
} 