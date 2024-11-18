import 'package:flutter/material.dart';
import 'package:mobile/class/services.dart';

class ServicesGrid extends StatelessWidget {
  final List<Service> services;
  final Function(Service) onServiceSelected; 

  const ServicesGrid({
    super.key,
    required this.services,
    required this.onServiceSelected,
  });

  @override
  Widget build(BuildContext context) {
    return LayoutBuilder(
      builder: (context, constraints) {
        int crossAxisCount = constraints.maxWidth > 1000
            ? 5
            : constraints.maxWidth > 800
            ? 4
            : constraints.maxWidth > 600
            ? 3
            : 2;
        double childAspectRatio = constraints.maxWidth > 800 ? 1.2 : 1;

        return Padding(
          padding: const EdgeInsets.all(16.0),
          child: GridView.builder(
            itemCount: services.length,
            gridDelegate: SliverGridDelegateWithFixedCrossAxisCount(
              crossAxisCount: crossAxisCount,
              crossAxisSpacing: 16.0,
              mainAxisSpacing: 16.0,
              childAspectRatio: childAspectRatio,
            ),
            itemBuilder: (context, index) {
              return InkWell(
                onTap: () {
                  onServiceSelected(services[index]);
                },
                child: ServiceCard(service: services[index]),
              );
            },
          ),
        );
      },
    );
  }
}

class ServiceCard extends StatelessWidget {
  final Service service;
  
  const ServiceCard({
    required this.service,
    super.key,
  });

  @override
  Widget build(BuildContext context) {
    return Card(
      shape: RoundedRectangleBorder(
        borderRadius: BorderRadius.circular(12.0),
      ),
      elevation: 4,
      child: Padding(
        padding: const EdgeInsets.all(8.0),
        child: Column(
          mainAxisAlignment: MainAxisAlignment.center,
          children: [
            Expanded(
              child: Image.asset(
                service.dataService!.iconPath,
                fit: BoxFit.contain,
              ),
            ),
            const SizedBox(height: 8),
            Text(
              service.dataService!.serviceName,
              textAlign: TextAlign.center,
              style: const TextStyle(
                fontFamily: "Murecho",
                fontSize: 16,
                fontWeight: FontWeight.bold,
                color: Color(0xFF1E3A8A),
              ),
            ),
          ],
        ),
      ),
    );
  }
}
