export default function MenuButton({ icon, title, desc, onClick }) {
  return (
    <div
      className="bg-white rounded-lg shadow-md p-6 text-center hover:shadow-lg cursor-pointer"
      onClick={onClick}
    >
      <div className="text-4xl text-red-800 mb-4">{icon}</div>
      <h3 className="text-xl font-bold">{title}</h3>
      <p className="text-gray-600">{desc}</p>
    </div>
  );
}
