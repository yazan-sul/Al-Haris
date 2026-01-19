import React from "react";
import PrivacyCard from "./PrivacyCard";

const Terms = () => {
  const sections = [
    {
      title: "الموافقة على الشروط",
      content: "باستخدامك لموقعنا فإنك توافق  على الالتزام بهذه الشروط .",
    },
    {
      title: "أهداف المنصة",
      content:
        "توفير بيئة آمنة تتيح للأهل ادارة المحتوى وحظر الروابط غير المرغوب بها لحماية العائلة.",
    },
    {
      title: "دقة المعلومات",
      content:
        "يجب إدخال معلومات صحيحة ودقيقة عند التسجيل، ويُمنع انتحال هوية أو استخدام بريد مزيف.",
    },
    {
      title: "الاستخدام الممنوع",
      content:
        "يُمنع استخدام الموقع لأي غرض غير قانوني، أو للإساءة أو نشر محتوى غير لائق.",
    },
    {
      title: "إدارة الحسابات",
      content:
        "نحتفظ بالحق في تعليق أو إيقاف أي حساب يسيء استخدام الميزات التقنية للمنصة  .",
    },
    {
      title: "الخصوصية والبيانات",
      content:
        "نحن نحترم خصوصيتك؛ كافة الإعدادات والروابط التي يتم حظرها هي بيانات خاصة لا يتم مشاركتها مع أي جهة إعلانية.",
    },
    {
      title: "التعديلات",
      content:
        "يمكننا تعديل هذه الشروط في أي وقت، وسيتم إعلامك بذلك عبر الموقع.",
    },
  ];

  return (
    <div className="min-h-screen  py-10 px-4" dir="rtl">
      <div className="max-w-4xl mx-auto">
        <div className="text-center mb-12">
          <h1 className="text-3xl font-extrabold text-gray-900">
            شروط الاستخدام
          </h1>
        </div>

        <div className="flex shadow-xl rounded-xl flex-col gap-10">
          {sections.map((item, index) => (
            <PrivacyCard
              key={index}
              title={item.title}
              content={item.content}
            />
          ))}
        </div>
      </div>
    </div>
  );
};

export default Terms;
