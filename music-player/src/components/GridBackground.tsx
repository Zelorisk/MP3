export const GridBackground = () => {
  return (
    <>
      <div
        className="absolute inset-0 opacity-[0.03] pointer-events-none"
        style={{
          backgroundImage: `
            linear-gradient(to right, white 1px, transparent 1px),
            linear-gradient(to bottom, white 1px, transparent 1px)
          `,
          backgroundSize: "40px 40px",
        }}
      />

      <div className="absolute inset-0 opacity-[0.05] pointer-events-none">
        <div className="absolute left-[20%] top-0 bottom-0 w-px bg-gradient-to-b from-transparent via-white to-transparent" />
        <div className="absolute left-[40%] top-0 bottom-0 w-px bg-gradient-to-b from-transparent via-white to-transparent" />
        <div className="absolute left-[60%] top-0 bottom-0 w-px bg-gradient-to-b from-transparent via-white to-transparent" />
        <div className="absolute left-[80%] top-0 bottom-0 w-px bg-gradient-to-b from-transparent via-white to-transparent" />
      </div>
    </>
  );
};
