function AboutPage() {
  return (
    <section className="about-content">
      <div className="container">
        <h2>About My Interests</h2>
        
        <div className="about-section">
          <h3>What I Love About Gaming and Movies</h3>
          <img src="/assets/about1.jpg" alt="A person playing video games on a monitor with a gaming controller in hand." />

          <p>I usually play MOBA games and shooting games during my free time. Gaming is all about fun and challenge for me. I love the competition and the thrill of trying to outsmart opponents. It's a great way to test my skills and have a good time at the same time.</p>
          <p>When it comes to movies, I'm really into thriller, horror, and action films because they're not boring at all. These genres keep me entertained and help me relax whenever I have free time. Watching movies is my go-to for entertainment and relaxation. It's the perfect way to unwind after a busy day.</p>
          <p>Beyond just fun, gaming has taught me the importance of perseverance and strategic thinking. Whether I am coordinating with a team in a MOBA or practicing my aim in a shooting game, I am constantly learning how to stay calm under pressure. Similarly, watching action and horror movies allows me to analyze complex plots and appreciate the technical skill involved in filmmaking.</p>
          <blockquote>
            "The best way to predict the future is to create it." - Peter Drucker
          </blockquote>
        </div>

        <div className="about-section">
          <h3>My Journey with Coding</h3>
          <img src="/assets/about2.jpg" alt="Close-up of a computer screen displaying JavaScript code inside a dark-themed text editor." />

          <p>Coding is something I'm still learning, and honestly, it can be pretty challenging sometimes. But I keep practicing because I know it's a valuable skill. I like the idea of being able to create things from scratch, even if it's just simple websites or small programs right now.</p>
          <p>When things get too hard, I take breaks and come back with fresh eyes. I've learned that everyone starts somewhere, and it's okay to struggle as long as you keep trying. That's what this portfolio project is all about - practicing and improving my skills step by step.</p>
          <p>My journey with HTML and CSS has been a series of small victories. Every time I fix a layout issue or get a hover effect to work perfectly, it builds my confidence. I realized that the struggle of learning a new language is exactly what makes the final result so satisfying. I plan to continue building projects like this to refine my eye for design and my technical logic.</p>
        </div>

        <div className="timeline">
          <h3>My Learning Timeline</h3>
          <ol>
            <li>Started getting into online gaming during junior high school</li>
            <li>Spent a lot of time watching movies and different shows</li>
            <li>Got curious about coding when I was planning what course to take in college</li>
            <li>Began learning the basics of HTML and CSS in school</li>
            <li>Created this portfolio website to practice what I learned</li>
            <li>Planning to extend my knowledge in coding and learn more programming languages</li>
          </ol>
        </div>
      </div>
    </section>
  );
}

export default AboutPage;