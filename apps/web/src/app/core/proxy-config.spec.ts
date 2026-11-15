export {};
type NodeProcess = {
  cwd(): string;
  getBuiltinModule(id: 'node:fs'): { readFileSync(path: string, encoding: 'utf8'): string };
  getBuiltinModule(id: 'node:path'): { resolve(...paths: string[]): string };
};

const nodeProcess = (globalThis as unknown as { process: NodeProcess }).process;
const { readFileSync } = nodeProcess.getBuiltinModule('node:fs');
const { resolve } = nodeProcess.getBuiltinModule('node:path');
const proxy = JSON.parse(readFileSync(resolve(nodeProcess.cwd(), 'proxy.conf.json'), 'utf8')) as Record<string, { target: string; changeOrigin: boolean }>;

describe('development proxy', () => {
  it('forwards /api and /graphql to the local API on port 8080 and nothing else', () => {
    expect(Object.keys(proxy).sort()).toEqual(['/api', '/graphql']);
    expect(proxy['/api']).toMatchObject({ target: 'http://localhost:8080', changeOrigin: true });
    expect(proxy['/graphql']).toMatchObject({ target: 'http://localhost:8080', changeOrigin: true });
  });

  it('wires the proxy into the development serve target only', () => {
    const angular = JSON.parse(readFileSync(resolve(nodeProcess.cwd(), 'angular.json'), 'utf8')) as {
      projects: { web: { architect: { serve: { options?: { proxyConfig?: string }; configurations: Record<string, { proxyConfig?: string }> } } } };
    };
    const serve = angular.projects.web.architect.serve;

    expect(serve.options?.proxyConfig).toBe('proxy.conf.json');
    expect(serve.configurations['production']?.proxyConfig).toBeUndefined();
  });
});
