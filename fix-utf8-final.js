const fs = require('fs');
const path = require('path');

const filePath = path.join(__dirname, 'js', 'legacy.js');
let content = fs.readFileSync(filePath, 'utf8');

// Fix specific remaining corrupted UTF-8 characters
const replacements = [
    // Emojis that are still corrupted
    [/ðŸ’»/g, "💻"],  // computer
    [/ðŸ“¸/g, "📸"],  // camera
    [/ðŸŽµ/g, "🎵"],  // musical note
    [/ðŸŽ/g, "🍽"],  // plate with cutlery
    [/ðŸ‹/g, "🏋"],  // weight lifter
    [/â€/g, ""],    // zero width joiner
    [/â™€/g, "♀"],   // female sign
    [/ï¸/g, ""],    // variation selector
    [/ðŸ“·/g, "📷"],  // camera
    [/âœˆ/g, "✈"],   // airplane
    [/ðŸŒ/g, "🌍"],  // earth globe
    [/ðŸ§ /g, "🧠"],  // brain
    [/ðŸ’¡/g, "💡"],  // light bulb
    [/ðŸ£/g, "🍝"],  // spaghetti
    [/ðŸœ/g, "🍜"],  // ramen
    [/ðŸŽ¤/g, "🎤"],  // microphone
    [/ðŸ’ƒ/g, "💃"],  // dancer
    [/ðŸŽ¨/g, "🎨"],  // artist palette
    [/âœ¨/g, "✨"],   // sparkles
    [/ðŸ”¥/g, "🔥"],  // fire
    [/ðŸš€/g, "🚀"],  // rocket
    [/ðŸ—¼/g, "🗼"],  // Tokyo tower
    [/ðŸŒ¸/g, "🌸"],  // cherry blossom
    [/ðŸ’–/g, "💖"],  // sparkling heart
    [/ðŸ’¥/g, "💥"],  // collision
    [/ðŸ’ª/g, "💪"],  // flexed biceps
    [/ðŸƒ/g, "🏃"],  // runner
    [/â€/g, ""],    // zero width joiner
    [/â™€/g, "♀"],   // female sign
    [/ï¸/g, ""],    // variation selector
    [/ðŸŒ…/g, "🌅"],  // sunrise
    [/ðŸ˜/g, "😍"],  // smiling face with heart eyes
    [/ðŸ¤¯/g, "🤯"],  // exploding head
    [/ðŸŒ±/g, "🌱"],  // seedling
    [/ðŸŒ²/g, "🌲"],  // evergreen tree
    [/âœ¨/g, "✨"],   // sparkles
    [/ðŸª/g, "🪐"],  // ringed planet
    [/ðŸ’«/g, "💫"],  // dizzy
    [/ðŸŒ„/g, "🌌"],  // milky way
    [/ðŸ¤–/g, "🤖"],  // robot
    [/ðŸ¤¤/g, "🤤"],  // drooling face
    [/ðŸŽ¶/g, "🎶"],  // musical notes
    [/💻¥/g, "💻🔥"], // computer fire
    [/🏋®/g, "🏋️‍♂️"], // man lifting weights
    [/🏋¶/g, "🏋️‍♀️"], // woman lifting weights
];

replacements.forEach(([pattern, replacement]) => {
    content = content.replace(pattern, replacement);
});

fs.writeFileSync(filePath, content, 'utf8');
console.log('Remaining UTF-8 characters fixed successfully!');