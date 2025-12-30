import { useState } from 'react';
import { Link } from 'react-router-dom';
import { ArrowLeft, Sparkles, ChevronDown, MessageCircle } from 'lucide-react';

interface FAQItem {
    question: string;
    answer: string;
    category: string;
}

const FAQ = () => {
    const [activeCategory, setActiveCategory] = useState<string>('all');
    const [openIndex, setOpenIndex] = useState<number | null>(null);

    const categories = [
        { id: 'all', name: 'All Questions', icon: '📚' },
        { id: 'wishlist', name: 'Wishlist', icon: '📝' },
        { id: 'tracking', name: 'Tracking', icon: '🎁' },
        { id: 'delivery', name: 'Delivery', icon: '🚚' },
        { id: 'technical', name: 'Technical', icon: '⚙️' }
    ];

    const faqs: FAQItem[] = [
        {
            category: 'wishlist',
            question: 'How do I create a wishlist?',
            answer: 'Simply click on "Create Your Wishlist" button on the homepage, fill in your information, add your wishes, and submit! You\'ll receive a tracking code to monitor your gifts.'
        },
        {
            category: 'wishlist',
            question: 'Can I add multiple items to my wishlist?',
            answer: 'Absolutely! You can add as many items as you\'d like. Just remember, Santa considers how good you\'ve been this year when fulfilling wishes! 🎅'
        },
        {
            category: 'wishlist',
            question: 'Can I edit my wishlist after submitting?',
            answer: 'Unfortunately, once submitted, wishlists cannot be edited as the elves start working on them immediately. However, you can contact us if you need to make urgent changes.'
        },
        {
            category: 'tracking',
            question: 'How do I track my gifts?',
            answer: 'Use the tracking code you received when you submitted your wishlist. Enter it on the "Track Your Gifts" page to see real-time updates on your gift\'s journey from the North Pole!'
        },
        {
            category: 'tracking',
            question: 'I lost my tracking code. What should I do?',
            answer: 'Don\'t worry! If you provided an email address, check your inbox for the confirmation email. Otherwise, contact our support team with your name and submission date.'
        },
        {
            category: 'tracking',
            question: 'How often is tracking information updated?',
            answer: 'Tracking information is updated in real-time as your gifts move through different stages. During peak season, updates may take a few hours to reflect.'
        },
        {
            category: 'delivery',
            question: 'When will my gifts be delivered?',
            answer: 'All gifts are delivered on Christmas morning! Santa and his reindeer work through the night of December 24th to ensure every child wakes up to presents on December 25th. 🎄'
        },
        {
            category: 'delivery',
            question: 'Do I need to be home for delivery?',
            answer: 'No! Santa has magical ways of delivering gifts even when you\'re asleep. Just make sure to leave out some cookies and milk! 🍪🥛'
        },
        {
            category: 'delivery',
            question: 'What if I\'m traveling during Christmas?',
            answer: 'Santa knows where you are! When creating your wishlist, you can specify your location during Christmas, and Santa will deliver there.'
        },
        {
            category: 'delivery',
            question: 'Can I choose a specific delivery time?',
            answer: 'Santa delivers all gifts during Christmas Eve night. The exact time is part of the Christmas magic and cannot be specified! ✨'
        },
        {
            category: 'technical',
            question: 'Is my information secure?',
            answer: 'Absolutely! We use elf-level security (the highest in the world) to protect your information. Your data is encrypted with Christmas magic and stored safely at the North Pole.'
        },
        {
            category: 'technical',
            question: 'Which browsers are supported?',
            answer: 'SantaOS works on all modern browsers including Chrome, Firefox, Safari, and Edge. For the best experience, please use the latest version of your browser.'
        },
        {
            category: 'technical',
            question: 'Can I use SantaOS on my phone?',
            answer: 'Yes! SantaOS is fully responsive and works perfectly on smartphones, tablets, and computers. Create wishlists and track gifts from any device!'
        },
        {
            category: 'wishlist',
            question: 'Is there an age limit for creating wishlists?',
            answer: 'SantaOS is designed for children of all ages! However, parents should supervise younger children when using the platform.'
        },
        {
            category: 'delivery',
            question: 'What countries does Santa deliver to?',
            answer: 'Santa delivers to all 195 countries around the world! No matter where you are, if you believe in the magic of Christmas, Santa will find you. 🌍'
        }
    ];

    const filteredFAQs = activeCategory === 'all'
        ? faqs
        : faqs.filter(faq => faq.category === activeCategory);

    const toggleFAQ = (index: number) => {
        setOpenIndex(openIndex === index ? null : index);
    };

    return (
        <div className="min-h-screen bg-gradient-to-br from-slate-950 via-blue-950 to-slate-900 text-white overflow-hidden relative">
            {/* Animated background */}
            <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNjAiIGhlaWdodD0iNjAiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+PGRlZnM+PHBhdHRlcm4gaWQ9ImdyaWQiIHdpZHRoPSI2MCIgaGVpZ2h0PSI2MCIgcGF0dGVyblVuaXRzPSJ1c2VyU3BhY2VPblVzZSI+PHBhdGggZD0iTSA2MCAwIEwgMCAwIDAgNjAiIGZpbGw9Im5vbmUiIHN0cm9rZT0icmdiYSgyNTUsMjU1LDI1NSwwLjAzKSIgc3Ryb2tlLXdpZHRoPSIxIi8+PC9wYXR0ZXJuPjwvZGVmcz48cmVjdCB3aWR0aD0iMTAwJSIgaGVpZ2h0PSIxMDAlIiBmaWxsPSJ1cmwoI2dyaWQpIiAvPjwvc3ZnPg==')] opacity-30"></div>
            <div className="absolute top-20 left-20 w-96 h-96 bg-blue-500/20 rounded-full blur-3xl animate-pulse"></div>
            <div className="absolute bottom-20 right-20 w-96 h-96 bg-cyan-500/20 rounded-full blur-3xl animate-pulse" style={{ animationDelay: '1s' }}></div>

            <div className="relative z-10 min-h-screen flex flex-col">
                {/* Header */}
                <div className="px-8 py-6 backdrop-blur-sm border-b border-white/5">
                    <Link to="/" className="inline-flex items-center gap-2 text-slate-400 hover:text-cyan-400 transition-colors group">
                        <ArrowLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform" />
                        <span className="text-sm font-medium">Back to Home</span>
                    </Link>
                </div>

                {/* Main Content */}
                <div className="flex-1 px-4 py-12">
                    <div className="max-w-4xl mx-auto">
                        {/* Page Title */}
                        <div className="text-center mb-12">
                            <div className="inline-flex items-center gap-2 px-4 py-2 bg-cyan-500/10 border border-cyan-500/20 rounded-full text-sm text-cyan-400 mb-6">
                                <Sparkles className="w-4 h-4" />
                                <span>Get Your Questions Answered</span>
                            </div>
                            <h1 className="text-5xl lg:text-6xl font-bold mb-4">
                                <span className="bg-gradient-to-r from-cyan-400 to-blue-500 bg-clip-text text-transparent">
                                    Frequently Asked Questions
                                </span>
                            </h1>
                            <p className="text-xl text-slate-400 max-w-2xl mx-auto">
                                Find answers to common questions about SantaOS and Christmas gift delivery! 🎄
                            </p>
                        </div>

                        {/* Category Filter */}
                        <div className="bg-slate-800/40 backdrop-blur-xl rounded-3xl p-6 border border-slate-700/50 shadow-2xl mb-12">
                            <div className="flex flex-wrap gap-3 justify-center">
                                {categories.map((category) => (
                                    <button
                                        key={category.id}
                                        onClick={() => setActiveCategory(category.id)}
                                        className={`px-6 py-3 rounded-xl font-semibold text-sm transition-all duration-300 ${activeCategory === category.id
                                                ? 'bg-gradient-to-r from-cyan-500 to-blue-600 text-white shadow-lg shadow-cyan-900/50 scale-105'
                                                : 'bg-slate-900/50 text-slate-300 hover:bg-slate-900 hover:text-white border border-slate-700/50'
                                            }`}
                                    >
                                        <span className="mr-2">{category.icon}</span>
                                        {category.name}
                                    </button>
                                ))}
                            </div>
                        </div>

                        {/* FAQ List */}
                        <div className="space-y-4 mb-12">
                            {filteredFAQs.map((faq, index) => (
                                <div
                                    key={index}
                                    className="bg-slate-800/40 backdrop-blur-xl rounded-2xl border border-slate-700/50 shadow-xl overflow-hidden hover:border-cyan-500/50 transition-all"
                                >
                                    <button
                                        onClick={() => toggleFAQ(index)}
                                        className="w-full px-6 py-5 flex items-center justify-between text-left hover:bg-slate-800/60 transition-colors"
                                    >
                                        <span className="font-bold text-lg text-white pr-8">
                                            {faq.question}
                                        </span>
                                        <ChevronDown
                                            className={`w-6 h-6 text-cyan-400 flex-shrink-0 transition-transform duration-300 ${openIndex === index ? 'rotate-180' : ''
                                                }`}
                                        />
                                    </button>

                                    <div
                                        className={`overflow-hidden transition-all duration-500 ease-in-out ${openIndex === index ? 'max-h-96 opacity-100' : 'max-h-0 opacity-0'
                                            }`}
                                    >
                                        <div className="px-6 pb-6 text-slate-300 leading-relaxed border-t border-slate-700/50 pt-4">
                                            {faq.answer}
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>

                        {/* Still Have Questions */}
                        <div className="bg-gradient-to-r from-cyan-500/10 to-blue-500/10 backdrop-blur-xl rounded-3xl p-10 border border-cyan-500/20 text-center">
                            <MessageCircle className="w-16 h-16 mx-auto mb-6 text-cyan-400" />
                            <h2 className="text-3xl font-bold mb-4 text-white">
                                Still Have Questions?
                            </h2>
                            <p className="text-slate-300 mb-8 max-w-2xl mx-auto">
                                Can't find the answer you're looking for? Our friendly support team is here to help!
                            </p>
                            <Link
                                to="/user/contact"
                                className="inline-flex items-center gap-2 px-10 py-4 bg-gradient-to-r from-cyan-500 to-blue-600 rounded-xl font-semibold shadow-lg shadow-cyan-900/50 hover:shadow-xl hover:scale-[1.02] transition-all"
                            >
                                <Sparkles className="w-5 h-5" />
                                <span>Contact Support</span>
                            </Link>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default FAQ;
