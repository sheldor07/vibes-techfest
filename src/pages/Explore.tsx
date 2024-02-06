import { useEffect, useState } from "react";
import { useOutletContext } from "react-router-dom";
import downloadSvg from "./../assets/dashboard/download.svg";
import { PROXY_SERVER_URL } from "@/lib/backend-urls";
import { Skeleton } from "@/components/ui/skeleton"; // Import the Skeleton component

const Explore = () => {
  const [isLoading, setIsLoading] = useState(true);
  const context = useOutletContext() as any; // Cast the context to 'any'

  const { setCurrentSong, currentSong } = context; // Now you can destructure without TypeScript errors
  const [songData, setSongData] = useState([]);

  useEffect(() => {
    const fetchData = async () => {
      const response = await fetch(
        `${PROXY_SERVER_URL}/techfest-public-library`,
        {
          method: "GET",
          headers: {
            "x-api-key": "nnLMkw79ne4xidb1Mp3nzaq8BsbYAhht5YwVrSR7",
          },
        }
      );
      const data = await response.json();
      console.log("data", data);

      if (!response.ok) {
        console.log("error in fetching data");
        return;
      } else {
        setSongData(data);
      }
    };
    fetchData();
  }, []);
  useEffect(() => {
    if (songData.length > 0) {
      setIsLoading(false);
    }
  }, [songData]);

  const handleSongSelect = (url) => {
    setCurrentSong(url);
    console.log("currentSong", currentSong);
  };
  const generateFilename = (name) => {
    return name.toLowerCase().replace(/\s+/g, "-") + ".wav";
  };

  // Skeleton Loader for each song item
  const songSkeleton = (
    <div className="flex flex-row p-2 w-[800px] rounded-md border-transparent items-center justify-between">
      <div>
        <Skeleton className="h-4 w-[200px]" />
        <Skeleton className="h-4 w-[150px]" />
      </div>
      <div className="flex items-center">
        <Skeleton className="h-4 w-16 mr-4" />
        <Skeleton className="h-8 w-8" />
      </div>
    </div>
  );

  return (
    <div>
      <h1 className="scroll-m-20 text-4xl font-extrabold tracking-tight lg:text-5xl">
        Explore
      </h1>
      <p className="text-md mt-2 text-muted-foreground">
        Explore and get inspired by the innovative universe <br></br> of
        AI-generated tunes crafted by brilliant minds around the globe.
      </p>
      {isLoading ? (
        <div className="grid grid-cols-1 gap-1 mt-12">
          {Array(10)
            .fill(null)
            .map((_, idx) => (
              <div key={idx} className="flex items-center space-x-4">
                <div className="space-y-2">
                  <Skeleton className="h-8 w-[800px]" />
                </div>
              </div>
            ))}
        </div>
      ) : (
        <div className="grid grid-cols-1 gap-1 mt-12">
          {songData.map((song) => (
            <div
              key={song.id}
              className={`flex flex-row p-2 w-[800px] rounded-md ${
                currentSong === song.url
                  ? " bg-purple-200"
                  : "border-transparent"
              }  hover:bg-neutral-200  duration-500 items-center justify-between`}
              onClick={() => handleSongSelect(song.url)}
            >
              <div>
                <h2 className="text-md font-semibold">{song.name}</h2>
                <p className="text-sm text-muted-foreground">{song.genre}</p>
              </div>
              <div className="flex items-center">
                <p className="text-sm text-muted-foreground mr-4">
                  {song.duration}
                </p>
                <a
                  href={song.url}
                  download={generateFilename(song.name)}
                  className=" text-white font-bold py-1 px-2 rounded inline-flex items-center"
                >
                  <img src={downloadSvg} className="w-5" />
                </a>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default Explore;
