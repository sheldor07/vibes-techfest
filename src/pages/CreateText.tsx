import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Slider } from "@/components/ui/slider";
import { useOutletContext } from "react-router-dom";
import Loader from "@/components/ui/loader";
import toast from "react-hot-toast";
import { useEffect } from "react";
import lockSvg from "./../assets/dashboard/lock.svg";
import { useNavigate } from "react-router-dom";
import { EC2_SERVER_URL } from "@/lib/backend-urls";
import { Toggle } from "@/components/ui/toggle";
const CreateText = () => {
  const navigate = useNavigate();
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  useEffect(() => {
    if (localStorage.getItem("authToken")) {
      setIsLoggedIn(true);
    }
  }, []);
  const context = useOutletContext() as any; // Cast the context to 'any'

  const { setCurrentSong, currentSong } = context; // Now you can destructure without TypeScript errors
  const [selectedGenre, setSelectedGenre] = useState(null);
  const [sliderValue, setSliderValue] = useState(10); // Default value
  const [description, setDescription] = useState("");
  const [loading, setLoading] = useState(false);
  const [isPrivate, setIsPrivate] = useState(false);
  const handleToggle = () => {
    console.log("isPrivate", isPrivate);
    setIsPrivate(!isPrivate);
  };
  const handleGenreClick = (genre) => {
    setSelectedGenre(genre);
  };

  const handleSliderChange = (bpm) => {
    setSliderValue(bpm);
  };

  const handleDescriptionChange = (event) => {
    setDescription(event.target.value);
  };
  // Handle the generation process
  const handleGenerate = async () => {
    if (!selectedGenre) {
      toast.error("Please select a genre");
      return;
    }

    if (!sliderValue) {
      toast.error("Please select a tempo");
      return;
    }
    if (!description) {
      toast.error("Please enter a description");
      return;
    }
    const payload = {
      token: localStorage.getItem("authToken"),
      prompt: description,
      genre: selectedGenre,
      private: isPrivate ? 1 : 0,
      duration: sliderValue[0],
    };

    // Process the data (in this case, just printing to the console)
    console.log(
      "Generating tune with the following data:",
      JSON.stringify(payload)
    );
    setLoading(true);
    const response = await fetch(`${EC2_SERVER_URL}/text/`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(payload),
    });
    if (response.ok) {
      toast.success("Tune generated successfully!");
      setCurrentSong(response.url);
      setLoading(false);
    } else {
      toast.error("Failed to generate tune");
      setLoading(false);
    }

    // You can send this data to a server or use it as needed
  };

  const backgroundMusicGenres = [
    "Funk/Dance",
    "Tribal",
    "Ballad",
    "EDM (Electronic Dance Music)",
    "Electronic",
    "Space Exploration",
    "Nature Documentary",
    "Classic Rock",
    "Jazz",
    "Orchestral",
    "Synthwave",
    "Tech News",
    "Grounding/Mindfulness",
    "Sci-Fi",
    "Comedy",
    "Action",
    "Meditation/Relaxation",
    "Stress Relief",
    "Game",
    "Garden Journey",
    "Survival Horror",
    "Deep Focus",
    "Ambient Electronic",
    "Deep Rest",
    "House Music",
    "Psytrance",
    "Lo-fi Hip-hop",
    "Drum and Bass",
    "Space Music",
    "Crime Podcast",
    "Philosophical",
    "Nature Connection",
    "Peaceful Village",
    "Stealth Game",
    "Melancholic",
    "Ambient",
    "Talk Show",
    "Chillwave",
    "Deep Relaxation",
    "Exploration Game",
    "Smooth Jazz",
    "Spiritual",
    "Peaceful",
    "Romantic",
    "Podcast Outro",
    "Poetry Reading",
    "Mobile Game",
    "Dubstep",
    "Focus/Work",
    "Focus",
    "Dream Pop",
    "Pop",
    "Techno",
    "Film Noir",
    "Children's Story",
    "Adventure",
    "Heavy Metal",
    "Tragic Plot Twist",
    "Horror",
    "Victory",
    "Film Scoring",
    "Travel/Outdoor",
    "Study Session",
    "Fantasy",
  ];

  return (
    <div>
      {isLoggedIn ? (
        <>
          <h1 className="scroll-m-20 text-4xl font-extrabold tracking-tight lg:text-5xl">
            Create
          </h1>{" "}
          <p className="text-md mt-2 text-muted-foreground">
            {" "}
            Create and customize your own AI-generated tunes <br></br> with the
            power of AI and machine learning.
          </p>
          <div className="flex flex-col">
            <h3 className="mt-8 scroll-m-20 text-xl font-semibold tracking-tight">
              1. Select your music genre{" "}
            </h3>
            <div className="flex flex-row flex-wrap gap-4 mt-4">
              {backgroundMusicGenres.map((genre) => (
                <button
                  key={genre}
                  className={`flex flex-row p-1 rounded-md items-center justify-between border-2 ${
                    selectedGenre === genre
                      ? "bg-purple-300 text-purple-800 border-purple-800 "
                      : "bg-primary/10"
                  }`}
                  onClick={() => handleGenreClick(genre)}
                >
                  <div>
                    <h2 className="text-xs font-semibold">{genre}</h2>
                  </div>
                </button>
              ))}
            </div>

            <div className="mt-8 grid grid-cols-2">
              <div>
                <h3 className="scroll-m-20 text-xl font-semibold tracking-tight">
                  2. Set your duration
                </h3>
                <div className="mt-4 inline-block w-72">
                  <Slider
                    onValueChange={handleSliderChange}
                    defaultValue={[10]}
                    max={30}
                    step={1}
                  />
                  <p className="text-sm mt-2 text-muted-foreground">
                    {sliderValue} Seconds
                  </p>
                </div>
              </div>{" "}
              <div>
                <h3 className="scroll-m-20 text-xl font-semibold tracking-tight">
                  3. Do you want to keep it private?
                </h3>
                <div className="flex items-center mt-2">
                  <input
                    id="privateToggle"
                    type="checkbox"
                    className="sr-only" // sr-only hides the actual checkbox but keeps it accessible
                    checked={isPrivate}
                    onChange={handleToggle}
                  />
                  <label
                    htmlFor="privateToggle"
                    className={`${
                      isPrivate ? "bg-purple-700" : "bg-gray-300"
                    } relative inline-flex h-6 w-11 items-center rounded-full transition-colors duration-300 ease-in-out`}
                  >
                    <span
                      className={`${
                        isPrivate ? "translate-x-6" : "translate-x-1"
                      } inline-block w-4 h-4 transform bg-white rounded-full transition-transform duration-300 ease-in-out`}
                    />
                  </label>
                  <span className="ml-3 text-sm font-medium text-gray-900">
                    {isPrivate ? "Private" : "Public"}
                  </span>
                </div>
              </div>
            </div>

            <h3 className="mt-8 scroll-m-20 text-xl font-semibold tracking-tight">
              4. Descibe your background music
            </h3>
            <textarea
              className="mt-4 w-full h-24 p-4 border-2 rounded-md"
              placeholder="Lo-Fi beats to study to..."
              value={description}
              onChange={handleDescriptionChange}
            ></textarea>
            <Button
              className="mt-8 bg-purple-700 flex items-center justify-center"
              variant="default"
              onClick={handleGenerate}
            >
              {loading ? <Loader /> : "Generate"}
            </Button>
          </div>
        </>
      ) : (
        <div>
          <div className="flex h-screen w-[1200px] flex-col items-center justify-center bg-white rounded-lg">
            <img src={lockSvg} alt="lock" className="w-20 mb-4" />
            <h2 className="mb-4 text-2xl font-semibold text-gray-800">
              Vibes are best if you're part of it
            </h2>
            <p className="mb-8 text-md text-gray-600">
              You need an account to access this page.
            </p>
            <Button
              className="bg-purple-700 text-white font-bold py-2 px-4 rounded hover:bg-purple-800"
              onClick={() => navigate("/signup")}
            >
              Signup
            </Button>
          </div>
        </div>
      )}
    </div>
  );
};
export default CreateText;
