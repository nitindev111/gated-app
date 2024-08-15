/** @type {import('tailwindcss').Config} */

module.exports = {
    content: ["./app/**/*.{js,jsx,ts,tsx}", "./app/components/**/*.{js,jsx,ts,tsx}"],
    theme: {
        extend: {
            colors: {
                primary: '#6575A8',
                secondary: '#E3C4E5',
                success: "#0BDA51",
                error: "#A52A2A",
                danger: "#EE4B2B",
                info: "",
                pending: ""
            }
        },
    },
    plugins: [],
}