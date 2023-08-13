import { PathGenerator } from './path_generator';

describe('PathGenerator', () => {
  it('should generate a path', () => {
    const pathGenerator = PathGenerator();
    expect(pathGenerator.monthPath(2024, 8, 'a')).toBe(`/2024/8?a`)
    expect(pathGenerator.monthPath(2024, 8, undefined)).toBe(`/2024/8`)
  });
})
