import React, { PureComponent } from 'react'
import PropTypes from 'prop-types'
import { View, FlatList, Dimensions } from 'react-native'

const d2 = (input, length) => {
  const output = []
  input.forEach((item, key) => {
    const x = Math.floor(key / length)
    if (!output[x]) {
      output[x] = []
    }
    output[x].push(item)
  })
  return output
}

class GridView extends PureComponent {
  static defaultProps = {
    data: [],
    span: 1,
    render: () => {},
    spacing: 0,
    border: 0,
    borderColor: 'black',
    square: false,
    flat: true,
  }

  constructor (props) {
    super(props)
    this.state = this.getDimensions()
  }

  getDimensions = (lvWidth) => {
    const { span, spacing } = this.props
    const totalWidth = lvWidth || Dimensions.get('window').width

    const totalSpacing = (span + 1) * spacing

    const itemWidth = Math.floor((totalWidth - totalSpacing) / span)

    return {
      itemWidth,
    }
  }

  onLayout = (e) => {
    const { width } = e.nativeEvent.layout || {}
    this.setState({
      ...this.getDimensions(width),
    })
  }

  itemStyle = (index) => {
    const { data, span, spacing, square, flat, border, borderColor } = this.props
    const { itemWidth } = this.state

    const isEnd = index >= ((Math.floor(data.length / span) - 1) * span)

    const style = {
      marginLeft: spacing,
      marginBottom: (!flat || isEnd) ? spacing : 0,
      marginTop: (index < span) ? spacing : 0,
      height: square ? itemWidth : 'auto',
      borderWidth: border,
      borderColor,
      borderLeftWidth: !spacing ? 0 : border,
      borderTopWidth: (!spacing && (index >= span)) ? 0 : border,
      borderRightWidth: (!spacing && !((index + 1) % span)) ? 0 : border,
    }
    return style
  }

  renderItem = ({ item, index }) => {
    const { itemWidth } = this.state
    const { render } = this.props

    return (
      <View style={[{ width: itemWidth }, this.itemStyle(index)]} key={index}>
        {render(item)}
      </View>
    )
  }

  render () {
    const { data, span, spacing, flat, ...props } = this.props
    return flat ? (
      <FlatList
        ItemSeparatorComponent={() => <View style={{ height: spacing }} />}
        onLayout={this.onLayout}
        data={data}
        numColumns={span}
        keyExtractor={(item, index) => index}
        renderItem={this.renderItem}
        {...props}
      />
    ) : (
      <View onLayout={this.onLayout}>
        {d2(data, span).map((tr, key) => (
          <View key={key} style={{ flexDirection: 'row' }}>
            {tr.map((td, k) => (
              <View key={k}>
                {this.renderItem({ item: td, index: (key * span) + k })}
              </View>
            ))}
          </View>
        ))}
      </View>
    )
  }
}

GridView.propTypes = {
  data: PropTypes.array,
  span: PropTypes.number,
  render: PropTypes.func,
  spacing: PropTypes.number,
  border: PropTypes.number,
  square: PropTypes.bool,
  borderColor: PropTypes.string,
  flat: PropTypes.bool,
}

export default GridView
