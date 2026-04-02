import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";

const faqs = [
  {
    question: "How long does delivery take?",
    answer:
      "Most orders are delivered within 1 to 3 business days depending on your location and product availability.",
  },
  {
    question: "Can I place an order without creating an account?",
    answer:
      "You can browse products freely, but placing orders requires sign-in so you can track purchases and delivery updates.",
  },
  {
    question: "Do you offer consultation before purchase?",
    answer:
      "Yes. Use the Contact Us page to book a consultation for crop planning, fertilizer strategy, and weed management advice.",
  },
  {
    question: "What payment methods are available?",
    answer:
      "We support Cash on Delivery and online card payment through Stripe on eligible orders.",
  },
  {
    question: "How can I track my order status?",
    answer:
      "After placing an order, go to My Orders to see status updates such as payment state and fulfillment progress.",
  },
  {
    question: "How do I contact support quickly?",
    answer:
      "You can reach us through the Contact Us page. Include your order details so we can assist you faster.",
  },
];

const FAQPage = () => {
  return (
    <>
      <Navbar />
      <main className="px-6 md:px-16 lg:px-32 py-12 min-h-[70vh]">
        <section className="max-w-3xl space-y-4">
          <p className="text-sm uppercase tracking-[0.2em] text-green-700">Help Center</p>
          <h1 className="text-3xl md:text-5xl font-medium text-gray-900">Frequently Asked Questions</h1>
          <p className="text-gray-600 text-base md:text-lg">
            Find quick answers about orders, payments, consultations, and support.
          </p>
        </section>

        <section className="mt-10 grid gap-4">
          {faqs.map((item) => (
            <article key={item.question} className="border border-gray-200 rounded-xl p-5 md:p-6 bg-white">
              <h2 className="text-lg md:text-xl font-medium text-gray-900">{item.question}</h2>
              <p className="text-gray-600 mt-2 leading-7">{item.answer}</p>
            </article>
          ))}
        </section>
      </main>
      <Footer />
    </>
  );
};

export default FAQPage;