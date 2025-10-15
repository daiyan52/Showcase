import axios from "axios";
import 'font-awesome/css/font-awesome.min.css'; // Import Font Awesome
import React from "react";
import { CLIENT_ID, CLIENT_SECRET } from './GithubCredential'; // Import client credentials

class GithubProfile extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      githubUserName: "daiyan52",  // Default GitHub username
      githubProfile: {},
      githubRepos: [],
      errorMessage: '',
    };
  }

  componentDidMount() {
    this.searchGithubUser(this.state.githubUserName); // Fetch data when component mounts
  }

  searchGithubUser = (githubUserName) => {
    const dataUrl = `https://api.github.com/users/${githubUserName}?client_id=${CLIENT_ID}&client_secret=${CLIENT_SECRET}`;
    
    axios.get(dataUrl)
      .then((response) => {
        this.setState({
          githubProfile: response.data,
        });
        return this.searchRepos(response.data.repos_url); // Fetch repositories after fetching profile
      })
      .catch((error) => {
        this.setState({ 
          errorMessage: error.response ? error.response.data.message : error.message 
        });
      });
  };

  searchRepos = (reposUrl) => {
    axios.get(reposUrl)
      .then((response) => {
        this.setState({ 
          githubRepos: response.data,
        });
      })
      .catch((error) => {
        this.setState({ 
          errorMessage: error.response ? error.response.data.message : error.message 
        });
      });
  };

  renderProfileTags = () => {
    const { bio } = this.state.githubProfile;
    if (!bio) return null;

    // Define some arbitrary bio tags for now
    const bioTags = bio.includes('Developer') ? 'Full Stack Developer' : bio.includes('Python') ? 'Python Developer' : 'Tech Enthusiast';
    
    return (
      <span className="inline-block bg-purple-200 text-gray-800 text-sm font-medium mr-2 px-2.5 py-0.5 rounded">
        {bioTags}
      </span>
    );
  };

  render() {
    const { githubProfile, githubRepos, errorMessage } = this.state;

    return (
      <div className="flex flex-wrap  text-xl font-serif justify-center mt-5">
        {/* Error Message */}
        {errorMessage && (
          <div className="alert alert-danger mt-3">{errorMessage}</div>
        )}

        {/* Profile Card */}
        {githubProfile.id && (
          <div className="max-w-xs w-full p-4  sm:max-w-sm md:max-w-md lg:max-w-lg">
            <div className="bg-white border rounded-lg shadow-md overflow-hidden h-full">
              <div className="p-4 sm:p-6 flex flex-col justify-between h-full">
                <div>
                  <img
                    src={githubProfile.avatar_url}
                    alt="Avatar"
                    className="w-60 h-60 shadow-lg rounded-full mx-auto mb-4"
                  />
                  <h3 className="font-semibold text-gray-800 text-lg sm:text-xl mb-2 text-center">
                    {githubProfile.login}
                  </h3>
                  <p className="text-gray-700 mb-4 text-sm sm:text-base text-center">
                    {githubProfile.name || "N/A"}
                  </p>
                  <div className="flex justify-center">
                    {this.renderProfileTags()}
                  </div>
                  <p className="text-gray-700 mt-4 text-sm sm:text-base">
                    <strong>Bio: </strong>{githubProfile.bio || "N/A"}
                  </p>
                  <p className="text-gray-700 mt-4 text-sm sm:text-base">
                    <strong>Followers: </strong>{githubProfile.followers}
                  </p>
                  <p className="text-gray-700 mt-4 text-sm sm:text-base">
                    <strong>Following: </strong>{githubProfile.following}
                  </p>
                  <p className="text-gray-700 mt-4 text-sm sm:text-base">
                    <strong>Public Repos: </strong>{githubProfile.public_repos}
                  </p>
                </div>
                <div className="mt-2 flex justify-center">
                  <a
                    href={githubProfile.html_url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-blue-500 text-lg sm:text-xl hover:underline"
                  >
                    <i className="fa fa-github mr-1"></i> View Profile on GitHub
                  </a>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    );
  }
}

export default GithubProfile;