import Container from "react-bootstrap/Container";
import Nav from "react-bootstrap/Nav";
import { default as BootstrapNavbar } from "react-bootstrap/Navbar";
import NavDropdown from "react-bootstrap/NavDropdown";
import "./Navbar.scss";

function Navbar() {
  return (
    <BootstrapNavbar expand="lg" className="navbar-container">
      <Container>
        <BootstrapNavbar.Brand href="#home">
          <img src={uwmsaLogo} alt="UWMSA Logo" height="40" />
        </BootstrapNavbar.Brand>
        <BootstrapNavbar.Toggle aria-controls="basic-navbar-nav" />
        <BootstrapNavbar.Collapse id="basic-navbar-nav">
          <Nav className="ms-auto nav-links">
            <NavDropdown
              title="About"
              id="about-nav-dropdown"
              renderMenuOnMount={true}
            >
              <NavDropdown
                title="Our Mission"
                id="our-mission-dropdown"
                renderMenuOnMount={true}
              >
                <NavDropdown.Item href="#land-acknowledgement">
                  Land Acknowledgement
                </NavDropdown.Item>
              </NavDropdown>
              <NavDropdown.Item href="#subteams">Subteams</NavDropdown.Item>
              <NavDropdown.Item href="#financial-reports">
                Financial Reports
              </NavDropdown.Item>
              <NavDropdown.Item href="#election-results">
                Election Results
              </NavDropdown.Item>
            </NavDropdown>

            <NavDropdown
              title="Campus"
              id="about-nav-dropdown"
              renderMenuOnMount={true}
            >
              <NavDropdown.Item href="#events">Events</NavDropdown.Item>
              <NavDropdown.Item href="#prayer-spaces">
                Prayer Spaces
              </NavDropdown.Item>
              <NavDropdown
                title="Halal Food"
                id="halal-food-dropdown"
                renderMenuOnMount={true}
              >
                <NavDropdown.Item href="#on-campus-halal-food">
                  On-Campus Halal Food
                </NavDropdown.Item>
                <NavDropdown.Item href="#off-campus-halal-food">
                  Off-Campus Halal Food
                </NavDropdown.Item>
              </NavDropdown>
              <NavDropdown.Item href="#housing">Housing</NavDropdown.Item>
            </NavDropdown>

            <NavDropdown
              title="Education"
              id="about-nav-dropdown"
              renderMenuOnMount={true}
            >
              <NavDropdown.Item href="#wellness-tips">
                Wellness Tips
              </NavDropdown.Item>
              <NavDropdown.Item href="#past-videos">
                Past Videos
              </NavDropdown.Item>
              <NavDropdown.Item href="#blogs">Blogs</NavDropdown.Item>
              <NavDropdown
                title="Fiqh Q&A"
                id="fiqh-qna-dropdown"
                renderMenuOnMount={true}
              >
                <NavDropdown.Item href="#fiqh-qna-submission">
                  Fiqh Q&A Submission
                </NavDropdown.Item>
              </NavDropdown>
            </NavDropdown>

            <NavDropdown
              title="Contact"
              id="contact-nav-dropdown"
              renderMenuOnMount={true}
            >
              <NavDropdown.Item href="#contact-us">Contact Us</NavDropdown.Item>
              <NavDropdown.Item href="#incident-report">
                Incident Report
              </NavDropdown.Item>
              <NavDropdown.Item href="#volunteer-sign-up">
                Volunteer Sign-up
              </NavDropdown.Item>
              <NavDropdown.Item href="#open-feedback">
                Open Feedback
              </NavDropdown.Item>
              <NavDropdown.Item href="#khutbah-feedback">
                Khutbah Feedback
              </NavDropdown.Item>
              <NavDropdown.Item href="#e-news-sign-up">
                E-news Sign-up
              </NavDropdown.Item>
              <NavDropdown.Item href="#prayer-space-feedback">
                Prayer Space Feedback
              </NavDropdown.Item>
            </NavDropdown>

            <Nav.Link href="#our-impact">Our Impact</Nav.Link>

            <NavDropdown
              title="Donate"
              id="donate-nav-dropdown"
              renderMenuOnMount={true}
            >
              <NavDropdown.Item href="#sponsor-us">Sponsor Us</NavDropdown.Item>
              <NavDropdown.Item href="#general-donation">
                General Donation
              </NavDropdown.Item>
            </NavDropdown>
          </Nav>
        </BootstrapNavbar.Collapse>
      </Container>
    </BootstrapNavbar>
  );
}

export default Navbar;