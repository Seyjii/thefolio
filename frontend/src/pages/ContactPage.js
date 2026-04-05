import { useState } from 'react';

function ContactPage() {
  const [formData, setFormData] = useState({ name: '', email: '', message: '' });
  const [errors, setErrors] = useState({ name: '', email: '', message: '' });

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
    // Clear error as user types
    setErrors({ ...errors, [e.target.name]: '' });
  };

  const validateContactForm = (e) => {
    e.preventDefault();
    let newErrors = { name: '', email: '', message: '' };
    let isValid = true;

    if (formData.name.trim() === "") {
        newErrors.name = "Name is required";
        isValid = false;
    }

    if (formData.email.trim() === "") {
        newErrors.email = "Email is required";
        isValid = false;
    } else {
        const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailPattern.test(formData.email)) {
            newErrors.email = "Please enter a valid email address";
            isValid = false;
        }
    }

    if (formData.message.trim() === "") {
        newErrors.message = "Message is required";
        isValid = false;
    } else if (formData.message.trim().length < 10) {
        newErrors.message = "Message must be at least 10 characters long";
        isValid = false;
    }

    setErrors(newErrors);

    if (isValid) {
        alert("Message sent successfully! Thank you for contacting me.");
        setFormData({ name: '', email: '', message: '' }); // Clear form
    }
  };

  return (
    <section className="contact-content">
      <div className="container">
        <h2>Get in Touch</h2>

        <form className="contact-form" id="contactForm" onSubmit={validateContactForm}>
          <h3>Send Me a Message</h3>

          <label htmlFor="name">Your Name:</label>
          <input type="text" id="name" name="name" value={formData.name} onChange={handleChange} className={errors.name ? 'invalid' : ''} />
          <span className="error-message" id="nameError">{errors.name}</span>

          <label htmlFor="email">Your Email:</label>
          <input type="email" id="email" name="email" value={formData.email} onChange={handleChange} className={errors.email ? 'invalid' : ''} />
          <span className="error-message" id="emailError">{errors.email}</span>

          <label htmlFor="message">Your Message:</label>
          <textarea id="message" name="message" rows="6" value={formData.message} onChange={handleChange} className={errors.message ? 'invalid' : ''}></textarea>
          <span className="error-message" id="messageError">{errors.message}</span>

          <button type="submit" className="btn">Send Message</button>
        </form>
            
       <div className="map-section">
          <h3>My Location: Interlaken, Switzerland</h3>
          <iframe 
            title="Map of Interlaken, Switzerland"
            src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d21791.734842145533!2d7.84837335!3d46.68631415!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x478f966416ca39e3%3A0x400811354366110!2sInterlaken%2C%20Switzerland!5e0!3m2!1sen!2s!4v1700000000000!5m2!1sen!2s" 
            width="100%" 
            height="450" 
            style={{ border: 0, borderRadius: '15px', boxShadow: '0 10px 40px rgba(157, 78, 221, 0.2)' }} 
            allowFullScreen="" 
            loading="lazy" 
            referrerPolicy="no-referrer-when-downgrade">
          </iframe>
        </div>

        <div className="resources">
          <h3>Helpful Resources</h3>
          <table>
            <thead>
              <tr>
                <th>Resource Name</th>
                <th>Description</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td><a href="https://www.w3schools.com" target="_blank" rel="noreferrer">W3Schools</a></td>
                <td>A comprehensive guide for learning HTML, CSS, and JavaScript.</td>
              </tr>
              <tr>
                <td><a href="https://developer.mozilla.org" target="_blank" rel="noreferrer">MDN Web Docs</a></td>
                <td>The official documentation for web standards and API references.</td>
              </tr>
              <tr>
                <td><a href="https://stackoverflow.com" target="_blank" rel="noreferrer">Stack Overflow</a></td>
                <td>A community-based Q&A platform for coding and debugging.</td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </section>
  );
}

export default ContactPage;