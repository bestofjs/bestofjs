type Props = {
  children: React.ReactNode;
};
export function ImageLayout({ children }: Props) {
  return (
    <div
      style={{
        display: "flex",
        fontSize: 48,
        color: "white",
        background: "#09090b",
        width: "100%",
        height: "100%",
        // justifyContent: "center",
        flexDirection: "column",
      }}
    >
      <div
        style={{
          borderBottom: "3px solid #3d3d42",
          display: "flex",
          padding: `24px 64px 16px`,
        }}
      >
        <AppLogo />
      </div>
      <div
        style={{
          display: "flex",
          flexDirection: "column",
          gap: 64,
          padding: 64,
        }}
      >
        {children}
      </div>
      <Footer />
    </div>
  );
}

function AppLogo() {
  return (
    <div style={{ color: "#ffa666", display: "flex" }}>
      <svg xmlns="http://www.w3.org/2000/svg" width="400" viewBox="0 0 700 200">
        <g transform="translate(-40 -30)">
          <path
            fill="currentColor"
            d="M40.7 40.2h17.6v90.2q0 15 8.7 25t22.5 10.2q15.2 0 24-11.2a35.6 35.6 0 007.6-22.4q0-16.4-10-25.2a30.8 30.8 0 00-20.8-7.6 39.6 39.6 0 00-14 2.4 60.3 60.3 0 00-11 5.8V89a40.5 40.5 0 0112.2-5.1 51.3 51.3 0 0111.6-1.5q20.4 0 34.6 12.6 15 13.6 15 35 0 21.6-12.6 36.4-13.6 16-36.6 16-21.2 0-35-14.8a49.9 49.9 0 01-13.8-35.2zM173.9 134.5l47.8-26.3a27.4 27.4 0 00-6.8-5.6q-6.4-3.4-15.6-3.4-14.2 0-23 10.8-7.8 10-7.8 24a32.1 32.1 0 008.6 21.9q8.6 9.7 23 9.7 14.8 0 22.2-8 6.8-6.8 9.8-22.2l17.6 2.4q0 15.4-12.6 29-15 16-38.2 16-19.4 0-34.1-14.1t-14.7-34.1q0-25 16.4-39.6a48 48 0 0132.8-12.6q16.6 0 27.7 7.4t19.3 23l-64.8 36zM261.1 164h49.6a29.4 29.4 0 007.2-1.6 7.3 7.3 0 004.2-7q0-7.6-15.2-12.5l-18.4-5.4q-14.2-4.8-20.2-10.2-7.2-6.3-7.2-17 0-14.2 11-20.8 8.2-5 21.8-5h41.4v16.8h-44.8q-11 0-11 8.6.6 5.8 10.4 9.6l18.6 5q17.2 4.8 24.4 12.4a25.8 25.8 0 017.2 18.4q0 14.6-11.4 21-7.6 4-19.8 4h-47.8zM355.7 150.3V59.8h17.4v24.6h34.4v16.8h-34.4v52.6a8.3 8.3 0 003.2 6.8q3 3 9.4 3h21.8v16.8h-22.2q-15.4 0-23-9-6.6-7.8-6.6-21zM415.3 131.2q0-20.8 15.6-35.2 14.8-13.6 34-13.6a51.4 51.4 0 0134 12.4q16.4 14 16.4 36.8a52.6 52.6 0 01-11.5 33.6q-13.6 17.2-35.1 17.2-23.7 0-38.5-14.7a48.4 48.4 0 01-14.9-35.7zm18.4-.4q0 14 6.8 23.2 8.6 11.6 25.5 11.6 14 0 21.7-8 8.8-9.2 8.8-27.6 0-13.6-8.9-22.2t-22.4-8.6q-15.3 0-24 10.4a32.4 32.4 0 00-7.5 21.2zM532.3 180.4v-105q0-18.6 11.4-28a31 31 0 0120.2-7.2h17.2V57h-12.6q-9.6 0-14.2 4.8-3.4 3.8-4.4 10.8v11.8h28.8v16.8H550v79.2zM570.5 223.8v-17.2h7.8q11.8 0 15.8-7 2.8-5.2 2.8-19.2v-96h17.6v105.8q0 14.8-8.6 23.6-9.6 10-27.2 10"
          />
          <circle fill="currentColor" cx="605" r="10" cy="65" />
          <path
            fill="currentColor"
            d="M633.7 164h49.6a29.4 29.4 0 007.2-1.6 7.3 7.3 0 004.2-7q0-7.6-15.2-12.5l-18.4-5.4q-14.2-4.8-20.2-10.2-7.2-6.3-7.2-17 0-14.2 11-20.8 8.2-5 21.8-5H708v16.8h-44.8q-11 0-11 8.6.6 5.8 10.4 9.6l18.6 5q17.2 4.8 24.4 12.4a25.8 25.8 0 017.2 18.4q0 14.6-11.4 21-7.6 4-19.8 4h-47.8z"
          />
        </g>
      </svg>
    </div>
  );
}

function Footer() {
  return (
    <div
      style={{
        height: 8,
        width: "100%",
        position: "absolute",
        bottom: 0,
        backgroundImage:
          "linear-gradient(135deg, #ffe38c 20%, #ffae63 40%, #f76d42, #d63c4a, #9c0042)",
      }}
    ></div>
  );
}

export function Box(props: React.HTMLAttributes<HTMLDivElement>) {
  const { style, ...rest } = props;
  return <div style={{ display: "flex", ...style }} {...rest} />;
}
