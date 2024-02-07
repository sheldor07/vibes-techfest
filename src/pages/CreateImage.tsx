import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Slider } from "@/components/ui/slider";
import { Input } from "@/components/ui/input";
import defaultImage from "./../assets/dashboard/default-image.png";
import toast from "react-hot-toast"; // Import toast for showing messages
import Loader from "@/components/ui/loader";
import { useOutletContext, useNavigate } from "react-router-dom";
import lockSvg from "./../assets/dashboard/lock.svg";
import { EC2_SERVER_URL } from "@/lib/backend-urls";
const CreateImage = () => {
  const context = useOutletContext() as any; // Cast the context to 'any'

  const { isLoggedIn, setCurrentSong, currentSong } = context; // Now you can destructure without TypeScript errors
  const navigate = useNavigate();
  const [sliderValue, setSliderValue] = useState(10);
  const [imagePreview, setImagePreview] = useState(defaultImage);
  const [loading, setLoading] = useState(false); // Loading state
  const [isPrivate, setIsPrivate] = useState(false);
  const handleToggle = () => {
    setIsPrivate(!isPrivate);
  };

  // Function to handle the change event of the slider
  const handleSliderChange = (bpm) => {
    setSliderValue(bpm);
  };

  // Function to handle the change event of the file input
  const handleImageChange = (event) => {
    const file = event.target.files[0];
    if (file && file.type.startsWith("image")) {
      // Create a URL for the image to display as a preview
      const reader = new FileReader();
      reader.onloadend = () => {
        if (typeof reader.result === "string") {
          setImagePreview(reader.result);
        }
      };
      reader.readAsDataURL(file);
    } else {
      setImagePreview(null);
    }
  };
  const handleGenerate = async () => {
    if (!imagePreview || imagePreview === defaultImage) {
      toast.error("Please upload an image");
      return;
    }

    if (!sliderValue) {
      toast.error("Please select a duration");
      return;
    }

    const payload = {
      token: localStorage.getItem("authToken"),
      private: isPrivate ? 1 : 0,
      image: imagePreview,
      duration: sliderValue,
    };

    console.log(
      "Generating tune with the following data:",
      JSON.stringify(payload)
    );

    setLoading(true);
    const response = await fetch(`${EC2_SERVER_URL}/image/`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(payload),
    });
    const data = await response.json();
    if (response.ok) {
      toast.success("Tune generated successfully!");
      setCurrentSong(data.url);
      setLoading(false);
    } else {
      toast.error("Failed to generate tune");
      setLoading(false);
    }
  };

  useEffect(() => {
    // Effect to handle when imagePreview changes, e.g., for sending to a server
    // Convert imagePreview back to file or use imageFile to send to server
    console.log(imagePreview);
  }, [imagePreview]);
  return (
    <div>
      {isLoggedIn ? (
        <>
          {" "}
          <h1 className="scroll-m-20 text-4xl font-extrabold tracking-tight lg:text-5xl">
            Inspire
          </h1>
          <p className="text-md mt-2 text-muted-foreground">
            Transform the essence of your images into unique AI-generated tunes.
            Let our advanced AI analyze<br></br> the mood, colors and elements
            of your image to compose the perfect background music <br></br>that
            complements your visual content.
          </p>
          <div className="flex flex-col">
            <h3 className="mt-8 scroll-m-20 text-xl font-semibold tracking-tight">
              1. Upload your image
            </h3>
            <div className="grid w-full max-w-lg items-center gap-1.5 ">
              {imagePreview && (
                <div className="mt-4">
                  <img
                    src={imagePreview}
                    alt="Image preview"
                    style={{ width: "100%", height: "auto" }}
                    className="rounded-md"
                  />
                </div>
              )}
              <Input id="picture" type="file" onChange={handleImageChange} />

              <div className="mt-4"></div>
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
        <div className="flex h-screen w-[1200px] flex-col items-center justify-center bg-white rounded-lg">
          <img src={lockSvg} alt="lock" className="w-20 mb-8" />
          <h2 className="mb-2 text-2xl font-semibold text-gray-800">
            Vibes are best if you're part of it
          </h2>
          <p className="mb-4 text-md text-muted-foreground">
            You need an account to access this page.
          </p>
          <Button
            variant="default"
            className="bg-purple-700 text-white font-bold py-2 px-4 rounded hover:bg-purple-800 "
            onClick={() => navigate("/signup")}
          >
            Signup
          </Button>
        </div>
      )}
    </div>
  );
};
export default CreateImage;
