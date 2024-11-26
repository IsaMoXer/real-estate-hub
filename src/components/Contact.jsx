import { useState } from "react"

import Button from "./Button"

function Contact({listing, contact, onSetContactLandlord}) {
  const [message, setMessage] = useState("")
  
  return (
    <div className="mt-6 flex flex-col justify-center gap-2">

      <p>Contact <span className="font-semibold">{contact?.fullName}</span> for the "{listing.listingTitle}" &rarr; ({contact.email})</p>

      <textarea
      className="w-full rounded border border-gray-400" 
      id="message"
      placeholder={`Write your message here or send it to: ${contact.email}`}
      value={message}
      onChange={(e)=>setMessage(e.target.value)}
      />

      <a href={`mailto:${contact.email}?Subject=${listing.listingTitle}?body=${message}`}>
      <Button onClick={()=> onSetContactLandlord(false)}>Send Message</Button>
      </a>

    </div>
  )
}
/* function Contact({ listing, contact, onSetContactLandlord }) {
  const [message, setMessage] = useState("");
  
  const handleSendMessage = () => {
    // Construct mailto link
    const subject = encodeURIComponent(listing.listingTitle);
    const body = encodeURIComponent(message);
    const mailtoLink = `mailto:${contact.email}?subject=${subject}&body=${body}`;
    
    // Open mail client
    window.location.href = mailtoLink;
    
    // Hide Contact component
    onSetContactLandlord(false);
    console.log('This is workikng..');
  };

  return (
    <div className="mt-6 flex flex-col justify-center gap-2">
      <p>Contact {contact?.fullName} for the "{listing.listingTitle}"</p>
      <textarea
        className="w-full rounded border border-gray-400"
        id="message"
        placeholder="Write your message here"
        value={message}
        onChange={(e) => setMessage(e.target.value)}
      />
      <Button onClick={handleSendMessage}>Send Message</Button>
    </div>
  );
} */
  
export default Contact;
