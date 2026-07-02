"use client";

import React from 'react';
import { motion } from 'framer-motion';
import './MethodologyBlock.css';

const steps = [
  {
    number: "01",
    title: "Levantamiento Técnico",
    description: "Inmersión en tu operación para entender no solo el perfil, sino el ecosistema y los desafíos técnicos del cargo."
  },
  {
    number: "02",
    title: "Búsqueda Dirigida",
    description: "Headhunting especializado y mapeo de mercado. Buscamos talento pasivo que encaje perfectamente con la cultura."
  },
  {
    number: "03",
    title: "Evaluación Integral",
    description: "Filtros técnicos, entrevistas por competencias y evaluación de adaptabilidad para la región de Magallanes."
  }
];

export default function MethodologyBlock() {
  return (
    <section className="methodology-section">
      <div className="fluid-container">
        
        <div className="methodology-header">
          <motion.h2 
            className="methodology-title"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
          >
            Nuestra Metodología
          </motion.h2>
          <motion.p 
            className="methodology-subtitle"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.1 }}
          >
            No somos una plataforma de currículums. Somos un socio estratégico que utiliza un proceso riguroso para asegurar contrataciones exitosas a largo plazo.
          </motion.p>
        </div>

        <div className="methodology-steps">
          {steps.map((step, index) => (
            <motion.div 
              className="methodology-step" 
              key={step.number}
              initial={{ opacity: 0, x: -30 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true, amount: 0.3 }}
              transition={{ duration: 0.6, delay: index * 0.2 }}
            >
              <div className="step-number">{step.number}</div>
              <div className="step-content">
                <h3 className="step-title">{step.title}</h3>
                <p className="step-desc">{step.description}</p>
              </div>
            </motion.div>
          ))}
        </div>
        
      </div>
    </section>
  );
}
