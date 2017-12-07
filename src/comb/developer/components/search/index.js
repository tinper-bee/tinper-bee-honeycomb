import { Component } from 'react';
import { InputGroup, FormControl, Icon} from 'tinper-bee';
import classnames from 'classnames';

import './index.less';

class Search extends Component{

  state = {
    searchValue: ''
  }

  /**
   * 搜索
   */
  handleSearch = () => {
    let { onSearch } = this.props;
    onSearch && onSearch(this.state.searchValue);
  }

  /**
   * 捕获回车
   * @param e
   */
  handleKeyDown = (e) => {
    if (e.keyCode === 13) {
      this.handleSearch();
    }
  }

  /**
   * 输入框改变
   * @param e
   */
  handleChange = (e) => {
    this.setState({
      searchValue: e.target.value
    })
  }


  /**
   * 清空输入框
   */
  emptySearch = () => {
    this.setState({
      searchValue: '',
    })
  }

  render() {
    let { className } = this.props;
    return (
      <InputGroup simple className={classnames("search-component", className)}>
        <FormControl
          onChange={ this.handleChange }
          value={ this.state.searchValue }
          onKeyDown={ this.handleKeyDown }
          type="text"
        />
        {
          this.state.searchValue ? (
            <Icon type="uf-close-c" onClick={ this.emptySearch } className="empty-search"/>
          ) : null
        }

        <InputGroup.Button onClick={ this.handleSearch } shape="border">
          <Icon type="uf-search"/>
        </InputGroup.Button>
      </InputGroup>
    )
  }
}

export default Search;
