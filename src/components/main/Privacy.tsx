import React from "react";
import PrivacyCard from "./PrivacyCard";

const PrivacyPolicy = () => {
  const sections = [
    {
      title: "البيانات التي نقوم نجمعها",
      content: "نقوم بجمع الاسم، البريد الإلكتروني، كلمة المرور .",
    },
    {
      title: "كيف نستخدم بياناتك",
      content:
        "نستخدم بياناتك لتسجيل الدخول، تخصيص تجربتك، ربطك بالمحتوى المناسب، وتحليل سلوكك بهدف تحسين الخدمة.",
    },
    {
      title: "حالة البرنامج",
      content:
        "عند تفعيل أو تعطيل البرنامج، يتم تحديث الحالة في خوادمنا لضمان مزامنة إعدادات الحماية على جميع أجهزتك.",
    },
    {
      title: "مشاركة البيانات",
      content:
        "نحن لا نبيع بياناتك ولا نشارك سجلات التصفح مع أي طرف ثالث. خصوصيتك هي أساس مشروعنا.",
    },
    {
      title: "حذف المعلومات",
      content: "يمكنك طلب حذف حسابك وبياناتك في أي وقت عبر صفحة اتصل بنا.",
    },
  ];

  return (
    <div className="min-h-screen  py-10 px-4" dir="rtl">
      <div className="max-w-4xl mx-auto">
        <div className="text-center mb-12">
          <h1 className="text-3xl font-extrabold text-gray-900">
            سياسة الخصوصية
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

export default PrivacyPolicy;
