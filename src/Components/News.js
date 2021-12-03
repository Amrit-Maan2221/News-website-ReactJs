import React, { Component } from 'react';
import NewsItem from './NewsItem';
import Spinner from './Spinner';
import PropTypes from 'prop-types'



export class News extends Component {

    static defaultProp = {
        country: "ca",
        pageSize: 8,
        category: "general"
    }

    static propTypes = {
        country: PropTypes.string,
        pageSize: PropTypes.number,
        category: PropTypes.string
    }

    constructor() {
        super();
        console.log("I am Constructor");
        this.state = {
            articles: [],
            page: 1,
            loading: false
        }
    }

    async updateNews() {
        let url = `https://newsapi.org/v2/top-headlines?country=${this.props.country}&category=${this.props.category}&apiKey=569da583ab3b46449c526fdbfb9a0117&page=${this.state.page}&pageSize=${this.props.pageSize}&pageSize=20`;
        this.setState({ loading: true });
        let data = await fetch(url);
        let parsedData = await data.json();
        this.setState({
            articles: parsedData.articles,
            loading: false,
            totalResults: parsedData.totalResults
        });
    }


    async componentDidMount() {
        this.updateNews();
    }

    handleNextClick = async () => {
        this.setState({
            page: this.state.page + 1
        });
        this.updateNews();
    }

    handlePrevClick = async () => {
        this.setState({
            page: this.state.page - 1
        });
        this.updateNews();
    }

    render() {
        return (
            <div className="container my-3">
                <h1 className="text-center" style={{ margin: '40px 0px' }}>Top Heading</h1>
                {this.state.loading && <Spinner />}
                {!this.state.loading && <div className="row">
                    {this.state.articles.map((element) => {
                        return <div className="col-md-4" key={element.url}>
                            <NewsItem source={element.source.name} author={!element.author ? "unknown" : element.author} date={element.publishedAt} title={element.title ? element.title.slice(0, 45) : ""} description={element.description ? element.description.slice(0, 88) : ""} imageUrl={element.urlToImage ? element.urlToImage : "https://i.cbc.ca/1.6267829.1638287636!/fileImage/httpImage/image.JPG_gen/derivatives/16x9_620/bc-flooding-20211126.JPG"} newsUrl={element.url} />
                        </div>
                    })}
                </div>}
                <div className="container d-flex justify-content-between">
                    <button disabled={this.state.page <= 1} type="button" className="btn btn-dark" onClick={this.handlePrevClick}>&larr; Previous</button>
                    <button type="button" disabled={this.state.page + 1 > Math.ceil(this.state.totalResults / this.props.pageSize)} className="btn btn-dark" onClick={this.handleNextClick}>Next &rarr;</button>
                </div>
            </div>
        )
    }
}

export default News
