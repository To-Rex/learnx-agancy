// import { Doughnut } from "react-chartjs-2";
// import { Chart as ChartJS, ArcElement, Tooltip, Legend } from "chart.js";

// ChartJS.register(ArcElement, Tooltip, Legend);

// const stats = [
//   { label: "Rejected", value: 30, color: "rgb(248, 52, 56)" },
//   { label: "Callback", value: 50, color: "rgb(255, 223, 40)" },
//   { label: "Approved", value: 20, color: "rgb(119, 232, 108)" },
// ];

// const data = {
//   labels: stats.map((s) => s.label),
//   datasets: [
//     {
//       data: stats.map((s) => s.value),
//       backgroundColor: stats.map((s) => s.color),
//       borderWidth: 2,
//       borderColor: "#fff",
//     },
//   ],
// };

// const options = {
//   plugins: {
//     legend: {
//       display: false,
//     },
//   },
//   cutout: "70%",
//   responsive: true,
//   maintainAspectRatio: false,
// };

// const Dashboard = () => {
//   return (
//     <div
//       style={{
//         maxWidth: 480,
//         margin: "40px auto",
//         padding: 24,
//         background: "#fff",
//         borderRadius: 16,
//         boxShadow: "0 2px 12px #0001",
//       }}
//     >
//       <h1
//         style={{
//           textAlign: "center",
//           fontSize: 32,
//           fontWeight: 700,
//           marginBottom: 32,
//         }}
//       >
//         Dashboard
//       </h1>
//       <div
//         style={{
//           width: 320,
//           height: 320,
//           margin: "0 auto",
//           position: "relative",
//         }}
//       >
//         <Doughnut data={data} options={options} />
//         <div
//           style={{
//             position: "absolute",
//             top: "50%",
//             left: "50%",
//             transform: "translate(-50%, -50%)",
//             textAlign: "center",
//           }}
//         >
//           <div style={{ fontSize: 28, fontWeight: 600 }}>Leads</div>
//           <div style={{ fontSize: 16, color: "#888" }}>Total: 100%</div>
//         </div>
//       </div>
//       <div
//         style={{
//           display: "flex",
//           justifyContent: "space-around",
//           marginTop: 32,
//         }}
//       >
//         {stats.map((stat, idx) => (
//           <div key={stat.label} style={{ textAlign: "center" }}>
//             <div
//               style={{
//                 width: 16,
//                 height: 16,
//                 borderRadius: "50%",
//                 background: stat.color,
//                 display: "inline-block",
//                 marginRight: 8,
//                 verticalAlign: "middle",
//               }}
//             ></div>
//             <span style={{ fontWeight: 600 }}>{stat.label}</span>
//             <div style={{ fontSize: 18 }}>{stat.value}%</div>
//           </div>
//         ))}
//       </div>
//     </div>
//   );
// };

// export default Dashboard;
