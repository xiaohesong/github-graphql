import React, { Component } from 'react';
import './App.css';
import {getIssuesOfRepositoryQuery, ADD_STAR} from './graphql/constants';
import {post} from './utils/request';
import {Organization} from './Organization';

const TITLE = 'React GraphQL GitHub Client';

class App extends Component {
  state = {
    path: 'ruby-china/homeland',
    organization: null,
    errors: null,
  };

  render() {
    const { path, organization, errors } = this.state;

    return (
      <div>
        <h1>{TITLE}</h1>

        <form onSubmit={this.onSubmit}>
          <label htmlFor="url">
            Show open issues for https://github.com/
          </label>
          <input
            id="url"
            type="text"
            value={path}
            onChange={this.onChange}
            style={{ width: '300px' }}
          />
          <button type="submit">Search</button>
        </form>

        <hr />

        {organization ? (
          <Organization 
            onFetchMoreIssues={this.onFetchMoreIssues} 
            organization={organization} 
            errors={errors}
            onStarRepository={this.onStarRepository}
          />
        ) : (
          <p>No information yet ...</p>
        )}
      </div>
    );
  }

  componentDidMount() {
    this.onFetchFromGitHub(this.state.path);
  }

  onChange = event => {
    this.setState({ path: event.target.value });
  };

  onSubmit = event => {
    // fetch data
    this.onFetchFromGitHub(this.state.path);
    event.preventDefault();
  };

  onFetchFromGitHub = (path, cursor) => {
    const [organization, repository] = path.split('/');
    console.log('origin', organization, repository);
    
    const params = getIssuesOfRepositoryQuery(organization, repository, cursor)
    post('', {
      query: params,
      variables: {
        organization,
        repository,
        cursor
      },
    })
      .then(result => {
        const { organization, errors } = result.data;
        
        if (!cursor) {
          this.setState({
            organization,
            errors,
          })
          return false
        }

        const { edges: oldIssues } = this.state.organization.repository.issues;
        const { edges: newIssues } = organization.repository.issues;
        const updatedIssues = [...oldIssues, ...newIssues];


        this.setState(() => ({
          organization: {
            ...organization,
            repository: {
              ...organization.repository,
              issues: {
                ...organization.repository.issues,
                edges: updatedIssues,
              },
            },
          },
          errors,
        }))
      });
  }

  onFetchMoreIssues = () => {
    const {
      endCursor,
    } = this.state.organization.repository.issues.pageInfo;

    this.onFetchFromGitHub(this.state.path, endCursor);
  }

  onStarRepository = (repositoryId, viewerHasStarred) => {
    post('', {
      query: ADD_STAR,
      variables: {
        repositoryId
      },
    }).then(result => {
      console.log('result is', result);
      const {
        viewerHasStarred,
      } = result.data.addStar.starrable;
      const { totalCount } = this.state.organization.repository.stargazers;
      this.setState({
        ...this.state,
        organization: {
          ...this.state.organization,
          repository: {
            ...this.state.organization.repository,
            viewerHasStarred,
            stargazers: {
              totalCount: totalCount + 1,
            },
          },
        },
      })
    })
  };

}

export default App;
