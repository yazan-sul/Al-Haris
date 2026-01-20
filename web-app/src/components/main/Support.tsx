import PrivacyCard from "./PrivacyCard";

const ContactUs = () => {
  const teamEmails = [
    {
      title: "الدعم الفني",
      content:
        "للمشاكل التقنية أو الاستفسارات حول تشغيل البرنامج: yazan5sulaiman@gmail.com",
    },
    {
      title: "قسم الإدارة والشكاوى",
      content:
        "للتواصل المباشر مع إدارة المنصة بخصوص الحسابات: osamams518@gmail.com",
    },
    {
      title: "علاقات المستخدمين",
      content: "للمقترحات وتطوير تجربة المستخدم: Yazanmadek9@gmail.com",
    },
    {
      title: "الاستفسارات العامة",
      content: "لأي معلومات إضافية حول المشروع: Yousefjebreel@gmail.com",
    },
  ];

  return (
    <div
      className="min-h-screen bg-gray-50 rounded-xl outline outline-gray-100 my-4 py-16 px-4 "
      dir="rtl"
    >
      <div className="max-w-4xl mx-auto">
        <div className="text-center mb-12">
          <h1 className="text-3xl font-extrabold text-gray-900 mb-4 tracking-tight">
            اتصل بنا
          </h1>
          <p className="text-gray-600 max-w-2xl mx-auto">
            فريقنا متاح دائماً للإجابة على تساؤلاتكم. يمكنك التواصل مع القسم
            المختص مباشرة عبر البريد الإلكتروني .
          </p>
        </div>

        <div className="grid gap-6 sm:grid-cols-2">
          {teamEmails.map((member, index) => (
            <div
              key={index}
              className="transform transition-transform hover:-translate-y-1"
            >
              <PrivacyCard title={member.title} content={member.content} />
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default ContactUs;
