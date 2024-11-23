// components/StockTicker.tsx
import { useState } from "react";

interface StockData {
	symbol: string;
	price: number;
	change: number;
}

const initialStocks: StockData[] = [
	{ symbol: "TSLA", price: 185.72, change: 2.5 },
	{ symbol: "NIO", price: 5.23, change: -0.8 },
	{ symbol: "RIVN", price: 12.45, change: 1.2 },
	{ symbol: "XPEV", price: 9.87, change: 0.5 },
	{ symbol: "LI", price: 28.93, change: 3.2 },
	{ symbol: "VWAGY", price: 13.45, change: -0.3 },
];

export function StockTicker() {
	// eslint-disable-next-line @typescript-eslint/no-unused-vars
	const [stocks, setStocks] = useState(initialStocks);

	return (
		<div className="bg-gray-900 text-white py-2 overflow-hidden">
			<div className="animate-ticker inline-flex whitespace-nowrap">
				{[...stocks, ...stocks].map((stock, index) => (
					<div key={index} className="mx-8 flex items-center">
						<span className="font-bold">{stock.symbol}</span>
						<span className="ml-2">${stock.price}</span>
						<span
							className={`ml-2 ${
								stock.change >= 0 ? "text-green-400" : "text-red-400"
							}`}
						>
							{stock.change >= 0 ? "+" : ""}
							{stock.change}%
						</span>
					</div>
				))}
			</div>
		</div>
	);
}
