"use client";
import react, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import "../../styles/History.css";
import Navbar from "../../components/Navbar";
import Footer from "../../components/Footer";
import { useTheme } from "next-themes";
import { useAccount } from "wagmi";
import Image from "next/image";
import trx from "../assets/trx.png";

interface LeaderboardEntry {
    address: string;
    invites: number;
    claims: number;
}

const LeaderBoard: React.FC = () => {
    const router = useRouter();
    // const [error, setError] = useState(null);

    const { theme } = useTheme();
    const [leaderboardData, setLeaderboardData] = useState<LeaderboardEntry[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        const fetchLeaderboardData = async () => {
            try {
                const response = await fetch('/api/leaderboard');
                if (!response.ok) {
                    throw new Error('Failed to fetch leaderboard data');
                }
                const data = await response.json();
                setLeaderboardData(data);
            } catch (err) {
                setError('Failed to load leaderboard data');
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

            <div className="txbg ">
                <div className="max-w-6xl w-[90%] mx-auto my-[60px] ">
                    <div
                        className={` border-black border-b-0 p-[30px] shadow-lg ${theme === "dark" ? "bg-black" : "bg-white"
                            } rounded-tl-[40px] rounded-tr-[40px] items-center }`}
                    >
                        <div className="text-xl text-center text-[#FF3333] font-[700]">
                            Leaderboard
                        </div>
                    </div>

                    <div
                        className={`${theme === "dark"
                                ? "bg-[#0A0A0A]/80 backdrop-blur-[80px]"
                                : "bg-white/80 backdrop-blur-[80px]"
                            } rounded-br-[40px] rounded-bl-[40px] lg:py-[30px] lg:px-[30px] md:py-[50px] md:px-[30px] sm:py-[50px] sm:px-[30px] py-[30px] px-[30px]`}
                    >
                        <div className="overflow-x-auto h-[40vh] overflow-y-auto scrol">
                            {isLoading ? (
                                <p>Loading...</p>
                            ) : error ? (
                                <p className="text-red-500">{error}</p>
                            ) : (
                                <table className="min-w-full border-separate border-spacing-0">
                                    <thead>
                                        <tr className="text-left bg-opacity-50">
                                            <th className="px-4 py-2"> ID</th>
                                            <th className="px-4 py-2">Contract Address</th>
                                            <th className="px-4 py-2">Invite Friend</th>
                                            <th className="px-4 py-2">Claim Token</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {leaderboardData.map((entry, index) => (
                                            <tr key={entry.address}>
                                                <td className="px-4 py-2">{index + 1}</td>
                                                <td className="px-4 py-2">{entry.address}</td>
                                                <td className="px-4 py-2">{entry.invites}</td>
                                                <td className="px-4 py-2">{entry.claims}</td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            )}
                        </div>
                    </div>
                </div>
            </div>
            <Footer />
            <div></div>
        </div>
    );
};
export default LeaderBoard;