import { Server, Cpu, Activity, ArrowRight } from "lucide-react";

interface IntegrationProps {
  language: "en" | "pt";
}

const content = {
  en: {
    title: "Seamless Integration",
    subtitle: "Connects with your existing infrastructure",
    description: "API integration with legacy systems and IoT sensors. Compatible with Navtor and ShipDocs.",
    steps: ["Vessel IoT Sensors", "Python Backend", "LogBio Dashboard"],
  },
  pt: {
    title: "Integração Perfeita",
    subtitle: "Conecta-se com sua infraestrutura existente",
    description: "Integração via API com sistemas legados e sensores IoT. Compatível com Navtor e ShipDocs.",
    steps: ["Sensores IoT do Navio", "Backend Python", "Dashboard LogBio"],
  },
};

export const Integration = ({ language }: IntegrationProps) => {
  const t = content[language];

  return (
    <section className="py-24 bg-[#020617] text-white overflow-hidden">
      <div className="container px-4 mx-auto">
        <div className="flex flex-col lg:flex-row items-center gap-16">
          
          {/* Left Content */}
          <div className="lg:w-1/2">
            <h2 className="text-3xl md:text-4xl font-bold mb-6">
              {t.title}
            </h2>
            <p className="text-xl text-slate-400 mb-8">
              {t.description}
            </p>
            
            <div className="space-y-4">
              <div className="flex items-center gap-3 text-slate-300">
                <div className="w-2 h-2 rounded-full bg-green-500 shadow-[0_0_10px_rgba(34,197,94,0.5)]"></div>
                <span>REST API / GraphQL</span>
              </div>
              <div className="flex items-center gap-3 text-slate-300">
                <div className="w-2 h-2 rounded-full bg-blue-500 shadow-[0_0_10px_rgba(59,130,246,0.5)]"></div>
                <span>Real-time WebSocket</span>
              </div>
              <div className="flex items-center gap-3 text-slate-300">
                <div className="w-2 h-2 rounded-full bg-purple-500 shadow-[0_0_10px_rgba(168,85,247,0.5)]"></div>
                <span>End-to-end Encryption</span>
              </div>
            </div>
          </div>

          {/* Right Schematic Visual */}
          <div className="lg:w-1/2 w-full">
            <div className="relative p-8 rounded-2xl bg-slate-900/50 border border-slate-800 backdrop-blur-sm">
              <div className="flex flex-col gap-8 relative z-10">
                
                {/* Node 1 */}
                <div className="flex items-center gap-4 p-4 rounded-xl bg-slate-800 border border-slate-700">
                  <div className="p-3 rounded-lg bg-blue-500/20 text-blue-400">
                    <Server className="h-6 w-6" />
                  </div>
                  <div className="font-mono text-sm">{t.steps[0]}</div>
                </div>

                {/* Connector */}
                <div className="h-8 w-0.5 bg-slate-700 mx-auto relative">
                  <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-2 h-2 bg-slate-600 rounded-full animate-ping"></div>
                </div>

                {/* Node 2 */}
                <div className="flex items-center gap-4 p-4 rounded-xl bg-slate-800 border border-slate-700">
                  <div className="p-3 rounded-lg bg-yellow-500/20 text-yellow-400">
                    <Cpu className="h-6 w-6" />
                  </div>
                  <div className="font-mono text-sm">{t.steps[1]}</div>
                </div>

                {/* Connector */}
                <div className="h-8 w-0.5 bg-slate-700 mx-auto relative">
                  <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-2 h-2 bg-slate-600 rounded-full animate-ping delay-300"></div>
                </div>

                {/* Node 3 */}
                <div className="flex items-center gap-4 p-4 rounded-xl bg-[#003950] border border-[#006159] shadow-[0_0_30px_rgba(0,97,89,0.2)]">
                  <div className="p-3 rounded-lg bg-[#006159] text-white">
                    <Activity className="h-6 w-6" />
                  </div>
                  <div className="font-mono text-sm font-bold">{t.steps[2]}</div>
                </div>

              </div>

              {/* Background Glow */}
              <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-full h-full bg-blue-500/5 blur-3xl rounded-full -z-10"></div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
