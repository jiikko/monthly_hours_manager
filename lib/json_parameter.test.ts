import { JsonParameter } from './json_parameter';

describe('JsonParameter', () => {
  describe('serialize', () => {
    it('should serialize an object into a query string', () => {
      const obj = {
        name: 'Alice',
        standardTime: 25,
        week: { mon: true, tue: true, wed: true, thu: true, fri: true, sat: false, sun: false },
      };

      const result = JsonParameter.serialize(obj);
      expect(result).toBe(
        "name=%22Alice%22&standardTime=25&week=%7B%22mon%22%3Atrue%2C%22tue%22%3Atrue%2C%22wed%22%3Atrue%2C%22thu%22%3Atrue%2C%22fri%22%3Atrue%2C%22sat%22%3Afalse%2C%22sun%22%3Afalse%7D"
      );
    });

    it('monthsがundefinedの時は除外する', () => {
      const obj = {
        name: 'Alice',
        standardTime: 25,
        months: undefined,
        week: { mon: true, tue: true, wed: true, thu: true, fri: true, sat: false, sun: false },
      };

      const result = JsonParameter.serialize(obj);
      expect(result).toBe(
        "name=%22Alice%22&standardTime=25&week=%7B%22mon%22%3Atrue%2C%22tue%22%3Atrue%2C%22wed%22%3Atrue%2C%22thu%22%3Atrue%2C%22fri%22%3Atrue%2C%22sat%22%3Afalse%2C%22sun%22%3Afalse%7D"
      );
    });
  });

  describe('parse', () => {
    it('should parse a query string into an object', () => {
      const query = {
        name: 'hoge',
        age: '25',
        week: "%7B%22mon%22%3Atrue%2C%22tue%22%3Atrue%2C%22wed%22%3Atrue%2C%22thu%22%3Atrue%2C%22fri%22%3Atrue%2C%22sat%22%3Afalse%2C%22sun%22%3Afalse%7D",
      };

      const result = JsonParameter.parse(query);
      expect(result).toEqual({
        name: 'hoge',
        age: 25,
        week: { mon: true, tue: true, wed: true, thu: true, fri: true, sat: false, sun: false },
      });
    });
  });
})
