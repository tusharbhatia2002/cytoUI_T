export default function Register() {
    const handleSubmit = async (e) => {
      e.preventDefault();
  
      const email = e.target.email.value;
      const password = e.target.password.value;
  
      const response = await fetch('/api/auth/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password }),
      });
  
      if (response.ok) {
        // User registered successfully
        // Redirect to login page or display a success message
      } else {
        // Handle registration error
      }
    };
  
    return (
      <div>
        <h1>Register</h1>
        <form onSubmit={handleSubmit}>
          <input type="email" name="email" placeholder="Email" required />
          <input type="password" name="password" placeholder="Password" required />
          <button type="submit">Register</button>
        </form>
      </div>
    );
  }
  