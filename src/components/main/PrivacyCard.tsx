interface PrivacyCardProps {
  title: string;
  content: string;
}

const PrivacyCard = ({ title, content }: PrivacyCardProps) => (
  <div className="bg-white p-6  border-gray-100 ">
    <h2 className="text-xl font-bold text-gray-800 mb-3">{title}</h2>
    <p className="text-gray-600">{content}</p>
    <div className="relative mb-6 mt-6">
      <div className="absolute inset-0 flex items-center">
        <div className="w-full border-t border-gray-300"></div>
      </div>
    </div>
  </div>
);

export default PrivacyCard;
