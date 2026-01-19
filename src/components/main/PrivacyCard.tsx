interface PrivacyCardProps {
  title: string;
  content: string;
}

const PrivacyCard = ({ title, content }: PrivacyCardProps) => (
  <div className="bg-white p-6 border-gray-100 transition-all duration-300 rounded-xl">
    <h2 className="text-xl font-extrabold text-gray-900 mb-3 tracking-tight font-sans">
      {title}
    </h2>

    <p className="text-gray-600 font-medium text-sm md:text-base">{content}</p>

    <div className="relative mt-8">
      <div className="absolute inset-0 flex items-center">
        <div className="w-full border-t border-gray-100"></div>
      </div>
    </div>
  </div>
);

export default PrivacyCard;
