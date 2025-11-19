// src/pages/Api.tsx
import { useState, useEffect } from 'react';
import { ShieldCheck, Loader2, ServerCrash } from 'lucide-react';
import useAuth from '@/hooks/useAuth';
import apiClient from '@/services/api/client';
import { Card, CardContent, CardHeader, CardDescription } from '@evoapi/design-system';
import { Input } from '@evoapi/design-system';
import { Button } from '@evoapi/design-system';
import { Badge } from '@evoapi/design-system';
import { Skeleton } from '@evoapi/design-system';
import { cn } from '@/utils/cn';

interface ApiEndpoint {
  method: string;
  path: string;
  description: string;
  params: string[];
}

function EndpointCard({ method, path, description, params: paramNames = [] }: ApiEndpoint) {
  const { apiUrl, apiKey } = useAuth();
  const [params, setParams] = useState<Record<string, string>>({});
  const [response, setResponse] = useState<any>(null);
  const [error, setError] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(false);

  const handleParamChange = (name: string, value: string) => {
    setParams((prev) => ({ ...prev, [name]: value }));
  };

  const handleSendRequest = async () => {
    setIsLoading(true);
    setResponse(null);
    setError(null);

    let finalPath = path;
    paramNames.forEach((name) => {
      finalPath = finalPath.replace(`{${name}}`, params[name] || '');
    });

    try {
      const res = await apiClient.request({
        method: method as any,
        url: finalPath,
        baseURL: apiUrl,
        headers: {
          'apikey': apiKey,
        },
      });
      setResponse({
        status: res.status,
        data: res.data,
      });
    } catch (err: any) {
      setError({
        status: err.response?.status,
        data: err.response?.data || { message: err.message },
      });
    } finally {
      setIsLoading(false);
    }
  };

  const getStatusColor = (status: number) => {
    if (status >= 200 && status < 300) return 'bg-green-500';
    if (status >= 400 && status < 500) return 'bg-yellow-500';
    if (status >= 500) return 'bg-red-500';
    return 'bg-gray-500';
  };

  return (
    <Card className="overflow-hidden shadow-lg transition-all hover:shadow-2xl">
      <CardHeader>
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4">
            <Badge
              className={cn(
                  'text-sm font-bold',
                  method.toUpperCase() === 'GET' && 'bg-blue-500',
                  method.toUpperCase() === 'POST' && 'bg-green-500',
                  method.toUpperCase() === 'DELETE' && 'bg-red-500',
              )}
            >
              {method.toUpperCase()}
            </Badge>
            <code className="text-lg font-mono text-foreground">{path}</code>
          </div>
          <ShieldCheck className="h-6 w-6 text-green-500" />
        </div>
        <CardDescription className="pt-2">{description}</CardDescription>
      </CardHeader>
      <CardContent>
        {paramNames.length > 0 && (
          <div className="mb-4 space-y-2">
            <h4 className="font-semibold">Parameters</h4>
            {paramNames.map((name) => (
              <Input
                key={name}
                placeholder={name}
                onChange={(e) => handleParamChange(name, e.target.value)}
                className="font-mono"
              />
            ))}
          </div>
        )}
        <Button onClick={handleSendRequest} disabled={isLoading}>
          {isLoading ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : null}
          Send Request
        </Button>

        {response && (
          <div className="mt-6">
            <h4 className="font-semibold mb-2">Response</h4>
            <div className="flex items-center gap-2 mb-2">
              <span className={cn('px-2 py-0.5 rounded-full text-white text-xs', getStatusColor(response.status))}>
                {response.status}
              </span>
            </div>
            <pre className="mt-2 rounded-lg bg-muted p-4 text-sm overflow-x-auto">
              <code>{JSON.stringify(response.data, null, 2)}</code>
            </pre>
          </div>
        )}

        {error && (
          <div className="mt-6">
            <h4 className="font-semibold mb-2 text-red-500">Error</h4>
            <div className="flex items-center gap-2 mb-2">
              <span className={cn('px-2 py-0.5 rounded-full text-white text-xs', getStatusColor(error.status))}>
                {error.status || 'Client Error'}
              </span>
            </div>
            <pre className="mt-2 rounded-lg bg-red-500/10 p-4 text-sm text-red-500 overflow-x-auto">
              <code>{JSON.stringify(error.data, null, 2)}</code>
            </pre>
          </div>
        )}
      </CardContent>
    </Card>
  );
}

function Api() {
  const [endpoints, setEndpoints] = useState<ApiEndpoint[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchSwaggerDoc = async () => {
      try {
        const response = await apiClient.get('http://evolgo.fragenciamarketingdigital.com.br/swagger/doc.json');
        const swaggerData = response.data;

        const parsedEndpoints: ApiEndpoint[] = [];
        for (const path in swaggerData.paths) {
          for (const method in swaggerData.paths[path]) {
            const endpoint = swaggerData.paths[path][method];
            const params = endpoint.parameters ? endpoint.parameters.filter((p: any) => p.in === 'path').map((p: any) => p.name) : [];
            parsedEndpoints.push({
              path,
              method,
              description: endpoint.summary || endpoint.description || '',
              params,
            });
          }
        }
        setEndpoints(parsedEndpoints);
      } catch (err) {
        setError('Falha ao carregar a documentação da API.');
      } finally {
        setIsLoading(false);
      }
    };

    fetchSwaggerDoc();
  }, []);

  return (
    <div className="container mx-auto px-4 py-8">
      <header className="mb-10 text-center">
        <h1 className="text-5xl font-extrabold tracking-tight text-primary">
          API Documentation
        </h1>
        <p className="mt-4 text-lg text-muted-foreground">
          Explore e teste os endpoints da API Evolution GO.
        </p>
      </header>

      {isLoading && (
        <div className="space-y-12">
          {Array.from({ length: 5 }).map((_, i) => (
            <Skeleton key={i} className="h-48 w-full" />
          ))}
        </div>
      )}

      {error && (
        <div className="flex flex-col items-center justify-center text-center">
          <ServerCrash className="h-16 w-16 text-destructive mb-4" />
          <h2 className="text-2xl font-semibold text-destructive">Oops! Algo deu errado.</h2>
          <p className="text-muted-foreground mt-2">{error}</p>
        </div>
      )}

      {!isLoading && !error && (
        <div className="space-y-12">
          {endpoints.map((endpoint) => (
            <EndpointCard key={`${endpoint.method}-${endpoint.path}`} {...endpoint} />
          ))}
        </div>
      )}
    </div>
  );
}

export default Api;
