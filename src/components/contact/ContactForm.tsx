import { useState } from 'react';
import ContactService from '../../services/contactService';

// A more robust type for tracking the form's state
type FormStatus = 'idle' | 'loading' | 'success' | 'error';

interface IFormData {
  name: string;
  number: string;
  email: string;
  subject: string;
  message: string;
}

const initialFormData: IFormData = {
  name: '',
  number: '',
  email: '',
  subject: '',
  message: '',
};

const ContactForm = () => {
  const [formData, setFormData] = useState<IFormData>(initialFormData);
  
  // Use a single state for status, which is a more professional pattern
  const [status, setStatus] = useState<FormStatus>('idle');
  const [feedbackMessage, setFeedbackMessage] = useState('');

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prevState => ({
      ...prevState,
      [name]: value,
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setStatus('loading');
    setFeedbackMessage('');

    try {
      await ContactService.sendMessage(formData);
      setStatus('success');
      setFeedbackMessage('Message sent successfully! We will get back to you shortly.');
      setFormData(initialFormData); // Reset form on success
    } catch (error: any) {
      setStatus('error');
      // Try to get a more specific error message from the backend response
      const serverMessage = error.response?.data?.message || 'An unexpected error occurred.';
      setFeedbackMessage(`Submission failed: ${serverMessage}`);
      console.error('Submission error:', error);
    }
  };

  const isLoading = status === 'loading';

  return (
    <>
      <section className="contact-section-2 section-padding pt-0">
        <div className="container">
          <div className="row justify-content-center">
            <div className="col-xl-10">
              <div className="contact-form-items">
                <div className="title text-center">
                  <h2 className="wow fadeInUp">Send Us a Message</h2>
                  <p className="wow fadeInUp" data-wow-delay=".2s">
                    We'd love to hear from you! Fill out the form below and we'll get in touch.
                  </p>
                </div>
                
                <form id="contact-form" onSubmit={handleSubmit} noValidate>
                  <div className="row g-4">
                    <div className="col-lg-6 wow fadeInUp" data-wow-delay=".2s">
                      <input className="form-input" type="text" name="name" placeholder="Full Name" required value={formData.name} onChange={handleChange} />
                    </div>
                    <div className="col-lg-6 wow fadeInUp" data-wow-delay=".3s">
                      <input className="form-input" type="tel" name="number" placeholder="Phone Number (Optional)" value={formData.number} onChange={handleChange} />
                    </div>
                    <div className="col-lg-6 wow fadeInUp" data-wow-delay=".4s">
                      <input className="form-input" type="email" name="email" placeholder="Email Address" required value={formData.email} onChange={handleChange} />
                    </div>
                    <div className="col-lg-6 wow fadeInUp" data-wow-delay=".5s">
                      <input className="form-input" type="text" name="subject" placeholder="Subject of your message" required value={formData.subject} onChange={handleChange} />
                    </div>
                    <div className="col-lg-12 wow fadeInUp" data-wow-delay=".6s">
                      <textarea className="form-textarea" name="message" placeholder="Write your message here..." required rows={6} value={formData.message} onChange={handleChange}></textarea>
                    </div>
                    
                    <div className="col-12 text-center wow fadeInUp" data-wow-delay=".7s">
                      {status === 'success' || status === 'error' ? (
                        <div className={`feedback-message feedback-${status}`}>
                          <span className="feedback-icon">{status === 'success' ? '✓' : '✕'}</span>
                          {feedbackMessage}
                        </div>
                      ) : (
                        <button type="submit" className="theme-btn" disabled={isLoading}>
                          {isLoading && <span className="spinner"></span>}
                          {isLoading ? 'Sending...' : 'Send Message'}
                        </button>
                      )}
                    </div>
                  </div>
                </form>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Scoped CSS with the fix for the text color */}
      <style>
        {`
        /* --- Form Input & Textarea Styling --- */
        .form-input, .form-textarea {
          width: 100%;
          padding: 14px 18px;
          border-radius: 8px;
          border: 1px solid #ced4da;
          background-color: #f8f9fa;
          font-size: 1rem;
          /* THE FIX IS HERE: !important forces this color to be used */
          color: #495057 !important; 
          transition: border-color 0.2s ease, box-shadow 0.2s ease;
        }
        .form-input::placeholder, .form-textarea::placeholder {
          color: #6c757d;
        }
        .form-input:focus, .form-textarea:focus {
          outline: none;
          border-color: #80bdff;
          box-shadow: 0 0 0 3px rgba(0, 123, 255, 0.25);
          background-color: #fff;
        }

        /* --- Button Styling --- */
        .theme-btn {
          position: relative;
          display: inline-flex;
          align-items: center;
          justify-content: center;
          padding: 14px 35px;
          font-size: 1.1rem;
          font-weight: 600;
          border-radius: 50px;
          border: none;
          cursor: pointer;
          transition: background-color 0.3s, transform 0.2s, box-shadow 0.3s;
        }
        .theme-btn:hover:not(:disabled) {
          transform: translateY(-2px);
          box-shadow: 0 4px 15px rgba(0,0,0,0.1);
        }
        .theme-btn:disabled {
          background-color: #cccccc !important;
          color: #666666 !important;
          cursor: not-allowed;
          transform: translateY(0);
          box-shadow: none;
        }

        /* --- Loading Spinner for Button --- */
        .spinner {
          display: inline-block;
          width: 20px;
          height: 20px;
          border: 3px solid rgba(255, 255, 255, 0.4);
          border-radius: 50%;
          border-top-color: #fff;
          animation: spin 1s ease-in-out infinite;
          margin-right: 12px;
        }
        @keyframes spin {
          to { transform: rotate(360deg); }
        }

        /* --- Feedback Message Styling --- */
        .feedback-message {
          padding: 15px 20px;
          border-radius: 8px;
          font-weight: 500;
          animation: fadeIn 0.5s ease;
          display: flex;
          align-items: center;
          justify-content: center;
          max-width: 500px;
          margin: 0 auto;
        }
        .feedback-success {
          background-color: #d4edda;
          border: 1px solid #c3e6cb;
          color: #155724;
        }
        .feedback-error {
          background-color: #f8d7da;
          border: 1px solid #f5c6cb;
          color: #721c24;
        }
        .feedback-icon {
          font-size: 1.2rem;
          margin-right: 10px;
          line-height: 1;
        }
        @keyframes fadeIn {
          from { opacity: 0; transform: translateY(10px); }
          to { opacity: 1; transform: translateY(0); }
        }
        `}
      </style>
    </>
  );
};

export default ContactForm;