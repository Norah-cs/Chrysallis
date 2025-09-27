import ButterflyUnfolding from "../visuals/OrigamiButterfly";

export default function ProfilePage() {
  return (
    <div className="p-8">
      <h1 className="text-2xl font-bold mb-6">Your Journey</h1>
      <OrigamiButterfly />
      <p className="mt-4 text-gray-600">
        Each fold represents a practice session you’ve completed. Keep going —
        your butterfly is unfolding beautifully.
      </p>
    </div>
  );
}
