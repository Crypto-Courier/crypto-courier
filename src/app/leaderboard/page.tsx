"use client";
import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import "../../styles/History.css";
import Navbar from "../../components/Navbar";
import Footer from "../../components/Footer";
import { useTheme } from "next-themes";
import Image from "next/image";
import trophy from "../../assets/trophy.png";
import rankImage from "../../assets/rank.png";

interface LeaderboardEntry {
  address: string;
  invites: number;
  claims: number;
}

const LeaderBoard: React.FC = () => {
  const router = useRouter();
  const { theme } = useTheme();
  const [leaderboardData, setLeaderboardData] = useState<LeaderboardEntry[]>(
    []
  );
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchLeaderboardData = async () => {
      try {
        const response = await fetch("/api/leaderboard");
        if (!response.ok) {
          throw new Error("Failed to fetch leaderboard data");
        }
        const data = await response.json();
        setLeaderboardData(data);
      } catch (err) {
        setError("Failed to load leaderboard data");
        console.error(err);
      } finally {
        setIsLoading(false);
      }
    };

    fetchLeaderboardData();
  }, []);

  return (
    <div className="main">
      <Navbar />

      <div className="txbgg">
        <div className="bg-gradient-to-t to-[#0052FF]/[0.23] from-[#FF005C]/[0.23] py-[30px] backdrop-blur-[60px] h-full">
          <div className=" mx-auto my-8 md:my-12 lg:my-16 px-4 sm:px-6 lg:px-8">
            <div className="flex flex-col lg:flex-row items-center justify-between gap-8">
              <div className="flex flex-col items-center lg:w-1/3">
                <Image
                  src={trophy}
                  alt="Trophy"
                  className="w-48 md:w-64 lg:w-80"
                />
                <h1 className="text-2xl md:text-3xl lg:text-4xl font-bold mt-4">
                  LeaderBoard
                </h1>
              </div>

              <div className="w-full lg:w-2/3 overflow-x-auto">
                {isLoading ? (
                  <div className="h-40 md:h-60 lg:h-80 flex justify-center items-center text-lg md:text-xl">
                    Loading...
                  </div>
                ) : error ? (
                  <div className="text-red-700 h-40 md:h-60 lg:h-80 flex justify-center items-center text-lg md:text-xl">
                    {error}
                  </div>
                ) : (
                  <div className="overflow-x-auto">
                    <div className="w-full max-w-4xl mx-auto  rounded-3xl">
                      <div className=" rounded-3xl overflow-hidden">
                        <div className="grid grid-cols-4 gap-2 p-4 bg-white rounded-t-3xl">
                          {[
                            "Rank",
                            "Contract Address",
                            "Invited User",
                            "Claimed User",
                          ].map((header, index) => (
                            <div
                              key={index}
                              className="text-center font-semibold text-pink-500"
                            >
                              {header}
                            </div>
                          ))}
                        </div>
                        {leaderboardData.map((entry, index) => (
                          <div
                            key={entry.address}
                            className="grid grid-cols-4 gap-2 p-4 bg-[#000000]/[0.40] mb-1 last:mb-0 items-center border border-[#E265FF] backdrop-blur-3"
                          >
                            <div className="flex justify-center items-center">
                              <div className="w-8 h-8 relative">
                                <Image
                                  src={rankImage}
                                  alt="Rank"
                                  layout="fill"
                                  objectFit="contain"
                                />
                                <span className=" inset-0 flex items-center justify-center text-white font-bold">
                                  {index + 1}
                                </span>
                              </div>
                            </div>
                            <div className="text-center text-white truncate">
                              {`${entry.address.substring(
                                0,
                                6
                              )}....${entry.address.slice(-4)}`}
                            </div>
                            <div className="text-center text-white">
                              {entry.invites}
                            </div>
                            <div className="text-center text-white">
                              {entry.claims}
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
      <Footer />
    </div>
  );
};

export default LeaderBoard;
