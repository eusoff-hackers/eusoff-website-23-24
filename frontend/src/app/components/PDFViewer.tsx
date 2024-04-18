
const PDFViewer = () => {
    return (
      <div className="flex justify-center items-center h-screen w-full bg-gray-100">
        <iframe
          src="/rules_room_bid.pdf" // Change this to your PDF path
          frameBorder="0"
          width="80%"
          height="90%"
          className="shadow-lg rounded-lg"
          allowFullScreen
        ></iframe>
      </div>
    );
  };
  
  export default PDFViewer;
  