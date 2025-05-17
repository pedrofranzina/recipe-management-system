import { Link } from "wouter";
import { useState, useEffect } from "react";

function Footer() {
    const [formData, setFormData] = useState({
        name: '',
        email: ''
    });
    const [message, setMessage] = useState('');

    useEffect(() => {
        let timeoutId;
        if (message) {
            timeoutId = setTimeout(() => {
                setMessage('');
            }, 2000);
        }
        return () => {
            if (timeoutId) {
                clearTimeout(timeoutId);
            }
        };
    }, [message]);

    const apiUrl = import.meta.env.VITE_API_URL || 'http://localhost:3000/api';

    const handleChange = (e) => {
        setFormData({
            ...formData,
            [e.target.id]: e.target.value
        });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const response = await fetch(`${apiUrl}/subscribe`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(formData)
            });

            const data = await response.json();

            if (response.ok) {
                setMessage('Thank you for subscribing!');
                setFormData({ name: '', email: '' });
            } else {
                setMessage(data.message || 'Error subscribing. Please try again.');
            }
        } catch (error) {
            setMessage('Error connecting to the server. Please try again later.');
        }
    };

    return (
        <>
            <footer className="bg-[#D2B48C] h-[200px]">
                <div className="flex justify-between lg:justify-around mx-auto h-full items-center px-4">
                    <div className="flex flex-col items-center">
                        <Link href="/about" className="text-black hover:underline pb-6 text-2xl ">
                            About Me
                        </Link>
                        <div className="flex flex-col md:flex-row gap-4">
                            <a
                                href="https://www.instagram.com/pedrofranzina"
                            >
                                <img className="w-6 h-6" src="/img/instagram.png" alt="Instagram Icon" />
                            </a>
                            <a href="https://www.linkedin.com/in/pedrofranzina/">
                                <img className="w-6 h-6" src="/img/linkedin.png" alt="LinkedIn Icon" />
                            </a>
                            <a href="https://www.facebook.com/pedrofranzina">
                                <img className="w-6 h-6" src="/img/facebook.png" alt="Facebook Icon" />
                            </a>
                            <a href="https://www.github.com/pedrofranzina">
                                <img className="w-6 h-6" src="/img/github.png" alt="GitHub Icon" />
                            </a>
                        </div>
                        <div className="mt-4 flex space-x-4">
                        </div>
                    </div>
                    <div className="flex flex-col items-center space-y-4">
                        <form onSubmit={handleSubmit} className="flex flex-col items-center space-y-4">
                            <div className="flex items-center space-x-4">
                                <input
                                    id="name"
                                    type="text"
                                    placeholder="Name"
                                    value={formData.name}
                                    onChange={handleChange}
                                    required
                                    className="px-4 py-2 rounded-full text-[#000] placeholder-[#fff]/70 border-2 border-white
                                             focus:outline-none focus:ring-2 focus:ring-white/50"
                                />
                                <input
                                    id="email"
                                    type="email"
                                    placeholder="Email"
                                    value={formData.email}
                                    onChange={handleChange}
                                    required
                                    className="px-4 py-2 rounded-full text-[#000] placeholder-[#fff]/70 border-2 border-white
                                             focus:outline-none focus:ring-2 focus:ring-white/50"
                                />
                            </div>
                            <button
                                type="submit"
                                className="px-6 py-2 bg-white text-[#D2B48C] rounded-full font-semibold border-2 border-white
                                         hover:bg-white/90 transition-all duration-300 transform hover:scale-105
                                         shadow-lg hover:shadow-xl cursor-pointer w-full"
                            >
                                Subscribe
                            </button>
                            {message && (
                                <p className={`text-sm ${message.includes('Thank you') ? 'text-green-600' : 'text-red-600'}`}>
                                    {message}
                                </p>
                            )}
                        </form>
                    </div>
                </div>
            </footer>
        </>
    );
}

export default Footer;