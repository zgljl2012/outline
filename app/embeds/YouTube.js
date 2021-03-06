// @flow
import * as React from 'react';
import Frame from './components/Frame';

const URL_REGEX = /(?:https?:\/\/)?(?:www\.)?youtu\.?be(?:\.com)?\/?.*(?:watch|embed)?(?:.*v=|v\/|\/)([a-zA-Z0-9_-]{11})$/i;

type Props = {
  url: string,
  matches: string[],
};

export default class YouTube extends React.Component<Props> {
  static ENABLED = [URL_REGEX];

  render() {
    const { matches } = this.props;
    const videoId = matches[1];

    return (
      <Frame
        width="420px"
        height="235px"
        src={`https://www.youtube.com/embed/${videoId}?modestbranding=1`}
        title={`YouTube (${videoId})`}
      />
    );
  }
}
