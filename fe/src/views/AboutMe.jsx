function AboutMePage() {
    return (
        <div className="min-h-screen bg-[#FFF8DC]">
            <div className="container mx-auto px-4 py-8">
                <div className="max-w-3xl mx-auto bg-white rounded-xl shadow-lg overflow-hidden">
                    <div className="p-8">


                        <div className="mb-8">
                            <img
                                src="https://www.cookinghub.com/wp-content/uploads/2024/04/cookinghub-foundation-logo-square.jpg"
                                alt="Chef"
                                className="w-full h-64 object-cover rounded-lg mb-4"
                            />
                            <p className="text-gray-700 mb-4">
                                Hi, I'm Pedro Franzina — a junior full stack developer based in Sintra and Elvas, Portugal. With a unique background that bridges hospitality and SAP,
                                I bring a user-focused mindset to everything I build. My coding journey is driven by curiosity, resilience, and a desire to solve real-world problems through clean, efficient code.
                                I'm currently working on projects that sharpen my skills in both frontend and backend development, aiming to create seamless, intuitive web experiences.
                            </p>
                            <p className="text-gray-700 mb-4">
                                Outside of tech, I'm passionate about running and enjoy planning healthy meals for myself and my partner.
                                Whether I'm debugging code or experimenting with a new recipe, I believe in learning by doing — and always staying curious.
                            </p>
                        </div>

                        <div className="mb-8">
                            <h2 className="text-2xl font-bold text-[#D2B48C] mb-4">My Cooking Philosophy</h2>
                            <p className="text-gray-700 mb-4">
                                I believe that cooking should be accessible to everyone, regardless of their skill level.
                                That's why I focus on creating recipes that are:
                            </p>
                            <ul className="list-disc pl-5 text-gray-700 mb-4">
                                <li>Easy to follow with clear instructions</li>
                                <li>Made with readily available ingredients</li>
                                <li>Adaptable to different dietary preferences</li>
                                <li>Both delicious and nutritious</li>
                            </ul>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default AboutMePage;
